import { UserDto } from './user.dto';

export class DebtDto {
  id: number;
  name: string;
  amount: number;
  creditor: UserDto | null;
  debitor: UserDto | null;
  timestamp: Date;

  constructor(debt: any) {
    this.id = debt.id;
    this.name = debt.name;
    this.amount = debt.amount;
    if (debt.creditor) {
      this.creditor = new UserDto(debt.creditor);
    } else {
      this.creditor = null;
    }
    if (debt.debitor) {
      this.debitor = new UserDto(debt.debitor);
    } else {
      this.debitor = null;
    }
    this.timestamp = debt.timestamp;
  }
}
