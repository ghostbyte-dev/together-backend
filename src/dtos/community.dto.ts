import { UserDto } from './user.dto';

export class CommunityDto {
  id: number;
  name: string;
  admin: UserDto | undefined;
  // biome-ignore lint/suspicious/noExplicitAny: could be diffrent user types from prisma
  constructor(community: any) {
    this.id = community.id;
    this.name = community.name;
    this.admin = community.admin ? new UserDto(community.admin) : undefined;
  }
}
