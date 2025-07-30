import { CommunityDto } from './community.dto';

export class UserDto {
  id: number;
  email: string;
  name: string;
  profile_image: string | null;
  communities: CommunityDto[] | null;
  color: string;
  isAdmin?: boolean;

  // biome-ignore lint/suspicious/noExplicitAny: could be diffrent user types from prisma
  constructor(user: any) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    const baseUrl = `${process.env.PROTOCOL}${process.env.HOST}`;
    this.profile_image = user.profile_image ? `${baseUrl}${user.profile_image}` : null;
    this.communities = user.communities
      ? // biome-ignore lint/suspicious/noExplicitAny: could be diffrent user types from prisma
        user.communities.map((c: any) => new CommunityDto(c))
      : null;
    this.color = user.color;
    this.isAdmin = user.isAdmin;
  }
}
