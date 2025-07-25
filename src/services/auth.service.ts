import { inject, injectable } from 'tsyringe';
import { PrismaService } from './prisma.service';
import { ApiError } from '../errors/apiError';
import * as crypto from 'node:crypto';
import { MailService } from './mail.service';
import bcrypt from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';

@injectable()
export class AuthService {
  constructor(
    @inject(PrismaService) private prisma: PrismaService,
    @inject(MailService) private mailService: MailService,
  ) {}

  async register(email: string, name: string, password: string) {
    if (await this.isEmailAlreadyUsed(email)) {
      throw new ApiError('Email already used by an Account', 400);
    }
    if (!this.isValidPassword(password)) {
      throw new ApiError('invalid Password', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verificationcode: this.getEmailVerificationCode(),
      },
    });

    await this.mailService.sendVerificationMail(
      email,
      `${process.env.CLIENT_URL}/verify/${user.verificationcode}`,
    );
    return;
  }

  private isValidPassword(password: string): boolean {
    const pwStrength = /^(?=.*[A-Za-z])(?=.*\d)[\S]{6,}$/; // mindestens 6 Stellen && eine Zahl && ein Buchstabe
    return pwStrength.test(password);
  }

  private async isEmailAlreadyUsed(email: string): Promise<boolean> {
    const exisitingUserWithEmail = await this.prisma.user.findUnique({ where: { email: email } });
    if (!exisitingUserWithEmail) {
      return false;
    }
    return true;
  }

  private getEmailVerificationCode(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
      include: {
        communities: true,
      },
    });
    if (!user) {
      throw new ApiError('No user found with this email', 400);
    }

    const isPasswordMatch = bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new ApiError('Invalid Password', 400);
    }

    if (!user.verified) {
      throw new ApiError('This user is not verified yet!', 400);
    }

    const communitiesIds = user.communities.map((community) => community.id);
    const jwtToken = this.createJWT(user.id, user.email, user.name, communitiesIds);

    return jwtToken;
  }

  private createJWT(id: number, email: string, username: string, communities: number[]): string {
    return jwt.sign(
      { version: 4, user: { id, email, username, communities } },
      process.env.JWT_SECRET as Secret,
      {
        expiresIn: '1y',
      },
    );
  }

  async verifyEmail(verificationCode: string): Promise<void> {
    const verified = await this.isUserVerified(verificationCode);
    if (verified) {
      throw new ApiError('User was already Verified', 400);
    }
    await this.prisma.user.update({
      where: {
        verificationcode: verificationCode,
      },
      data: {
        verified: true,
        verificationcode: null,
      },
    });
    return;
  }

  private async isUserVerified(verificationCode: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: { verificationcode: verificationCode },
      select: {
        verified: true,
      },
    });
    if (!user) {
      throw new ApiError('user with verification code not found', 400);
    }
    return user.verified;
  }

  async resendVerificationEmail(email: string): Promise<void> {
    const verified = await this.isUserVerifiedByEmail(email);
    if (verified) {
      throw new ApiError('User was already Verified', 400);
    }
    const user = await this.prisma.user.update({
      where: {
        email: email,
      },
      data: {
        verificationcode: this.getEmailVerificationCode(),
      },
    });
    await this.mailService.sendVerificationMail(
      email,
      `${process.env.CLIENT_URL}/verify/${user.verificationcode}`,
    );
    return;
  }

  private async isUserVerifiedByEmail(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        verified: true,
      },
    });
    if (!user) {
      throw new ApiError('user with this email not found', 400);
    }
    return user.verified;
  }
}
