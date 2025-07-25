import { UserDto } from './user.dto';

export class BalanceDto {
  amount: number;
  otherUser: UserDto;

  constructor(amount: number, otherUser: any) {
    this.amount = amount;
    this.otherUser = new UserDto(otherUser);
  }
}
