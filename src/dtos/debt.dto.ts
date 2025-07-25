import { UserDto } from './user.dto';

export class DebtDto {
  id: number;
  name: string;
  amount: number;
  creditor: UserDto;
  debitor: UserDto;
  timestamp: Date;

  constructor(debt: any) {
    this.id = debt.id;
    this.name = debt.name;
    this.amount = debt.amount;
    this.creditor = new UserDto(debt.creditor);
    this.debitor = new UserDto(debt.debitor);
    this.timestamp = debt.timestamp;
  }
}
