import { UserDto } from './user.dto';

export class RequestDto {
  user: UserDto;
  date: Date;
  id: number;

  // biome-ignore lint/suspicious/noExplicitAny: can be something of prisma
  constructor(request: any) {
    this.user = new UserDto(request.user);
    this.date = request.date;
    this.id = request.id;
  }
}
