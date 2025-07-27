import { injectable, inject } from 'tsyringe';
import { PrismaService } from './prisma.service';
import { ShoppinglistItemDto } from '../dtos/shoppinglistItem.dto';
import { ApiError } from '../errors/apiError';

@injectable()
export class ShoppinglistService {
  constructor(@inject(PrismaService) private prisma: PrismaService) {}

  async getOpen(communityId: number): Promise<ShoppinglistItemDto[]> {
    const items = await this.prisma.shoppinglist_item.findMany({
      where: {
        fk_community_id: communityId,
        done: false,
      },
    });
    const shoppingListItems = items.map((item) => new ShoppinglistItemDto(item));
    return shoppingListItems;
  }

  async getDone(communityId: number): Promise<ShoppinglistItemDto[]> {
    const items = await this.prisma.shoppinglist_item.findMany({
      where: {
        fk_community_id: communityId,
        done: true,
        done_date: { gte: new Date(new Date().toISOString().split('T')[0]) },
      },
    });
    const shoppingListItems = items.map((item) => new ShoppinglistItemDto(item));
    return shoppingListItems;
  }

  async addItem(name: string, communityId: number): Promise<ShoppinglistItemDto> {
    const item = await this.prisma.shoppinglist_item.create({
      data: {
        name: name,
        fk_community_id: communityId,
      },
    });
    if (!item) {
      throw new ApiError('failed to create shopping item', 500);
    }
    return new ShoppinglistItemDto(item);
  }

  async updateItem(
    itemId: number,
    name: string | undefined,
    done: boolean | undefined,
    communityId: number,
  ): Promise<ShoppinglistItemDto> {
    const item = await this.prisma.shoppinglist_item.update({
      where: { id: itemId, fk_community_id: communityId },
      data: {
        name: name,
        done: done,
        done_date: done !== undefined && done ? new Date() : undefined,
      },
    });
    if (!item) {
      throw new ApiError('failed to create shopping item', 500);
    }
    return new ShoppinglistItemDto(item);
  }

  async deleteItem(itemId: number, communityId: number) {
    await this.prisma.shoppinglist_item.delete({
      where: { id: itemId, fk_community_id: communityId },
    });
    return;
  }
}
