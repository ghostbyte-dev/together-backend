import type { User } from './user';

export interface Community {
  id: number;
  name: string;
  code: string;
  adminId: number;
  admin: User;
  memberCount: number;
}
