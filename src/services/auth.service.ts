import { inject, injectable } from 'tsyringe';
import { PrismaService } from './prisma.service';
import { ApiError } from '../errors/apiError';
import * as crypto from 'node:crypto';
import { MailService } from './mail.service';
import bcrypt from 'bcryptjs';

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
}
