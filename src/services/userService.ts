import { inject, injectable } from 'tsyringe';
import { PrismaService } from './prismaService';
import { ApiError } from '../errors/apiError';
import type { user } from '@prisma/client';
import { UserDto } from '../dtos/user.dto';

@injectable()
export class UserService {
  constructor(@inject(PrismaService) private prisma: PrismaService) {}

  async getUserById(userId: number): Promise<UserDto> {
    const user: user | null = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        communities: true,
      },
    });
    if (!user) {
      throw new ApiError('user not found', 404);
    }
    return new UserDto(user);
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
}
