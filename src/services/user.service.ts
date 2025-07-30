import { inject, injectable } from 'tsyringe';
import { PrismaService } from './prisma.service';
import { ApiError } from '../errors/apiError';
import type { user } from '@prisma/client';
import { UserDto } from '../dtos/user.dto';
import bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';

@injectable()
export class UserService {
  constructor(
    @inject(PrismaService) private prisma: PrismaService,
    @inject(AuthService) private readonly authService: AuthService,
  ) {}

  async getUserById(userId: number, communityId: number | undefined): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        communities: true,
      },
    });
    if (!user) {
      throw new ApiError('user not found', 404);
    }
    const userDto = new UserDto(user);

    if (communityId && user.communities) {
      const currentCommunity = user.communities.find((community) => community.id === communityId);
      if (currentCommunity) {
        const adminId = currentCommunity?.fk_admin_id;
        if (user.id === adminId) {
          userDto.isAdmin = true;
        }
      }
    }

    return userDto;
  }

  async getAllUsers(): Promise<UserDto[]> {
    const users: user[] = await this.prisma.user.findMany();
    if (!users) {
      throw new ApiError('no user found', 404);
    }
    const userDtos = users.map((user: user) => new UserDto(user));
    return userDtos;
  }

  async updateUser(
    userId: number,
    name: string | undefined,
    email: string | undefined,
    profile_image: string | undefined,
    color: string | undefined,
  ) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: name,
        email: email,
        profile_image: profile_image,
        color: color,
      },
    });
    return user;
  }

  async changePassword(oldPassword: string, newPassword: string, userId: number) {
    if (oldPassword === newPassword) {
      throw new ApiError('New password must be different from the old password', 400);
    }
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new ApiError('user not found', 404);
    }
    const oldPasswordHash = user.password;
    const correctOldPassword = await bcrypt.compare(oldPassword, oldPasswordHash);
    if (!correctOldPassword) {
      throw new ApiError('wrong Password', 400);
    }
    const validNewPassword = this.authService.isValidPassword(newPassword);
    if (!validNewPassword) {
      throw new ApiError('invalid new Password', 400);
    }
    const newPasswordHash = await bcrypt.hash(newPassword, 12);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: newPasswordHash,
      },
    });
    return;
  }
}
