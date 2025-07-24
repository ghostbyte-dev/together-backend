export class ShoppinglistItemDto {
  id: number;
  name: string;
  done: boolean;
  done_date: Date | null;

  // biome-ignore lint/suspicious/noExplicitAny: prisma type
  constructor(shoppinglistItem: any) {
    this.id = shoppinglistItem.id;
    this.name = shoppinglistItem.name;
    this.done = shoppinglistItem.done;
    this.done_date = shoppinglistItem.done_date;
  }
}
