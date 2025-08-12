import { UserDto } from './user.dto';

export class CommunityDto {
  id: number;
  name: string;
  admin: UserDto | undefined;
  code: number;
  // biome-ignore lint/suspicious/noExplicitAny: could be diffrent user types from prisma
  constructor(community: any) {
    this.id = community.id;
    this.name = community.name;
    this.code = community.code;
    if (community.admin) {
      this.admin = new UserDto(community.admin);
    } else if (community.user_community_fk_admin_idTouser) {
      this.admin = new UserDto(community.user_community_fk_admin_idTouser);
    }
  }
}
