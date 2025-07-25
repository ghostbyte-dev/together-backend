import { injectable, inject } from 'tsyringe';
import { PrismaService } from './prisma.service';
import { ApiError } from '../errors/apiError';
import type { request, user } from '@prisma/client';
import { UserDto } from '../dtos/user.dto';
import { CommunityDto } from '../dtos/community.dto';
import { RequestDto } from '../dtos/request.dto';
import { DebtDto } from '../dtos/debt.dto';

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
}
