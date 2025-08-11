import { injectable, inject } from 'tsyringe';
import { PrismaService } from './prisma.service';
import { ApiError } from '../errors/apiError';
import type { request, user } from '@prisma/client';
import { UserDto } from '../dtos/user.dto';
import { CommunityDto } from '../dtos/community.dto';
import { RequestDto } from '../dtos/request.dto';

@injectable()
export class CommunityService {
  constructor(@inject(PrismaService) private prisma: PrismaService) {}

  async getById(communityId: number): Promise<CommunityDto> {
    const community = await this.prisma.community.findUnique({
      where: { id: communityId },
    });
    if (!community) {
      throw new ApiError(`Comunity with the id ${communityId.toString()} doesn't exist`, 404);
    }

    return new CommunityDto(community);
  }

  async getMine(userId: number): Promise<CommunityDto[]> {
    const communities = await this.prisma.community.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
    });
    if (!communities) {
      throw new ApiError(`an unexpected error occured`, 500);
    }
    const communitiesDtos = communities.map((community) => new CommunityDto(community));
    return communitiesDtos;
  }

  async getByCode(communityCode: number): Promise<CommunityDto> {
    const community = await this.prisma.community.findUnique({
      where: { code: communityCode },
      include: {
        user_community_fk_admin_idTouser: {
          select: {
            id: true,
            name: true,
            profile_image: true,
          },
        },
        _count: {
          select: {
            user: true,
          },
        },
      },
    });
    if (!community) {
      throw new ApiError(`Comunity with the id ${communityCode.toString()} doesn't exist`, 404);
    }
    return new CommunityDto(community);
  }

  async create(name: string, userId: number): Promise<CommunityDto> {
    const inviteCode = this.generateCommunityInviteCode();
    const community = await this.prisma.community.create({
      data: {
        name: name,
        code: inviteCode,
        fk_admin_id: userId,
      },
    });
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        communities: {
          connect: { id: community.id },
        },
      },
    });
    return new CommunityDto(community);
  }

  async updateName(name: string, communityId: number, userId: number) {
    const communityToUpdate = await this.prisma.community.findUnique({
      where: {
        id: communityId,
      },
    });
    if (!communityToUpdate) {
      throw new ApiError('Community not found', 404);
    }
    if (communityToUpdate.fk_admin_id !== userId) {
      throw new ApiError('Not admin of this community', 401);
    }
    const newCommunity = await this.prisma.community.update({
      where: {
        id: communityId,
      },
      data: {
        name: name,
      },
    });
    return new CommunityDto(newCommunity);
  }

  private generateCommunityInviteCode(): number {
    return Math.floor(Math.random() * (999999 - 100000)) + 100000;
  }

  async getRequests(userId: number, communityId: number): Promise<RequestDto[]> {
    const community = await this.prisma.community.findFirst({
      where: { fk_admin_id: userId, id: communityId },
      include: {
        request: {
          select: {
            id: true,
            date: true,
            user: {
              select: {
                id: true,
                name: true,
                profile_image: true,
              },
            },
          },
        },
      },
    });
    if (!community) {
      throw new ApiError('No Admin of this Community', 400);
    }

    const requests = community.request.map((_request) => new RequestDto(_request));
    return requests;
  }

  async acceptRequest(userId: number, communityId: number, requestId: number) {
    const communityOfAdmin = await this.getCommunityOfAdminWithRequests(userId, communityId);
    const request: request | undefined = communityOfAdmin.request.find(
      (request) => request.id === requestId,
    );
    if (!request) {
      throw new ApiError('Request not found', 404);
    }
    await this.prisma.user.update({
      where: { id: request.fk_user_id },
      data: {
        communities: {
          connect: { id: communityOfAdmin.id },
        },
      },
    });
    await this.prisma.request.delete({
      where: {
        id: request.id,
      },
    });
  }

  async declineRequest(userId: number, communityId: number, requestId: number) {
    const communityOfAdmin = await this.getCommunityOfAdminWithRequests(userId, communityId);
    const request: request | undefined = communityOfAdmin.request.find(
      (request) => request.id === requestId,
    );
    if (!request) {
      throw new ApiError('Request not found', 404);
    }
    await this.prisma.request.delete({
      where: {
        id: request.id,
      },
    });
  }

  private async getCommunityOfAdminWithRequests(userId: number, communityId: number) {
    const community = await this.prisma.community.findFirst({
      where: { fk_admin_id: userId, id: communityId },
      select: {
        id: true,
        request: true,
      },
    });
    if (!community) {
      throw new ApiError('No Admin of a Community', 400);
    }
    return community;
  }

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

    const users = community.users.map((user: user) => {
      const isAdmin = user.id === community.fk_admin_id;
      const userDto = new UserDto(user);
      userDto.isAdmin = isAdmin;
      return userDto;
    });

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
