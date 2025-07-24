import { injectable, inject } from 'tsyringe';
import { PrismaService } from './prisma.service';
import { ApiError } from '../errors/apiError';
import type { user } from '@prisma/client';
import { UserDto } from '../dtos/user.dto';

@injectable()
export class CommunityService {
  constructor(@inject(PrismaService) private prisma: PrismaService) {}

  async getMembers(communityId: number): Promise<UserDto[]> {
    const community = await this.prisma.community.findUnique({
      where: { id: communityId },
      include: {
        users: true,
      },
    });

    if (!community) {
      throw new ApiError('Community not found', 404);
    }

    const users = community.users.map((user: user) => new UserDto(user));

    if (!users) {
      throw new ApiError('no Users found in Community', 404);
    }
    return users;
  }

  async sendRequest(inviteCode: number, userId: number) {
    const community = await this.prisma.community.findUnique({
      where: { code: inviteCode },
    });
    if (!community) {
      throw new ApiError('No Community exists with this invite code', 404);
    }
    const alreadyExistingUserRequest = await this.prisma.request.findFirst({
      where: { fk_user_id: userId },
    });
    if (alreadyExistingUserRequest) {
      throw new ApiError('User already sent an Request', 400);
    }
    await this.prisma.request.create({
      data: {
        fk_user_id: userId,
        fk_community_id: community.id,
      },
    });
  }
}
