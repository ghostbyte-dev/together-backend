import { inject, injectable } from 'tsyringe';
import { PrismaService } from './prisma.service';
import { TodoDto } from '../dtos/todo.dto';

@injectable()
export class TodoService {
  constructor(@inject(PrismaService) private prisma: PrismaService) {}

  async create(
    name: string,
    description: string,
    userId: number,
    communityId: number,
  ): Promise<TodoDto> {
    const todo = await this.prisma.todo.create({
      data: {
        name: name,
        description: description,
        fk_user_creator_id: userId,
        fk_community_id: communityId,
        creationDate: new Date(Date.now()),
      },
      include: {
        creator: true,
      },
    });
    return new TodoDto(todo);
  }

  async update(
    id: number,
    done: boolean | undefined,
    name: string | undefined,
    description: string | undefined,
    communityId: number,
  ) {
    const todo = await this.prisma.todo.update({
      where: {
        id: id,
        fk_community_id: communityId,
      },
      data: {
        name: name,
        done: done,
        description: description,
      },
      include: {
        creator: true,
      },
    });
    return new TodoDto(todo);
  }

  async getTodos(done: boolean, communityId: number): Promise<TodoDto[]> {
    const todos = await this.prisma.todo.findMany({
      where: {
        done: done,
        fk_community_id: communityId,
      },
      include: {
        creator: true,
      },
    });
    const todosDto = todos.map((todo) => new TodoDto(todo));
    return todosDto;
  }
}
