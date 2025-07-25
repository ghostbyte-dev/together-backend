import { injectable, inject } from 'tsyringe';
import { PrismaService } from './prisma.service';
import { ApiError } from '../errors/apiError';
import type { debt, request, user } from '@prisma/client';
import { UserDto } from '../dtos/user.dto';
import { CommunityDto } from '../dtos/community.dto';
import { RequestDto } from '../dtos/request.dto';
import { DebtDto } from '../dtos/debt.dto';
import { BalanceDto } from '../dtos/balance.dto';

@injectable()
export class DebtService {
  constructor(@inject(PrismaService) private prisma: PrismaService) {}

  async create(
    name: string,
    amount: number,
    debitorId: number,
    creditorId: number,
    communityId: number,
  ): Promise<DebtDto> {
    const debt = await this.prisma.debt.create({
      data: {
        fk_community_id: communityId,
        fk_user_creditor_id: creditorId,
        fk_user_debitor_id: debitorId,
        name: name,
        amount: amount,
      },
      include: {
        debitor: true,
        creditor: true,
      },
    });
    return new DebtDto(debt);
  }

  async balance(userId: number, communityId: number): Promise<BalanceDto[]> {
    const debts = await this.getDebtsOfUser(userId, communityId);
    let groupedDebts = this.groupDebts(debts, userId);
    groupedDebts = groupedDebts.filter((balance: BalanceDto) => balance.amount !== 0);
    return groupedDebts;
  }

  private async getDebtsOfUser(userId: number, communityId: number) {
    const debts = await this.prisma.debt.findMany({
      where: {
        fk_community_id: communityId,
        OR: [{ fk_user_creditor_id: userId }, { fk_user_debitor_id: userId }],
      },
      select: {
        debitor: true,
        creditor: true,
        fk_user_creditor_id: true,
        fk_user_debitor_id: true,
        amount: true,
      },
    });
    return debts;
  }

  private groupDebts(debts: any[], userId: number): BalanceDto[] {
    const balances = new Map<UserDto, number>();
    const otherUsers: any[] = [];

    debts.forEach((debt) => {
      const isCreditor = debt.fk_user_creditor_id === userId;
      const counterpartyId = isCreditor ? debt.fk_user_debitor_id : debt.fk_user_creditor_id;
      otherUsers.push(isCreditor ? debt.debitor : debt.creditor);
      const amount = isCreditor ? debt.amount : -debt.amount;

      if (!balances.has(counterpartyId)) {
        balances.set(counterpartyId, 0);
      }

      // biome-ignore lint/style/noNonNullAssertion: is added just above if null
      balances.set(counterpartyId, balances.get(counterpartyId)! + Number(amount));
    });

    const result: BalanceDto[] = Array.from(balances.entries()).map(([otherUserId, amount]) => {
      const otherUser: any = otherUsers.find((user) => user.id === otherUserId);

      return new BalanceDto(amount, otherUser);
    });

    return result;
  }
}
