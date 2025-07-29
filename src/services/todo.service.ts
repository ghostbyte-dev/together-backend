import { inject, injectable } from 'tsyringe';
import { PrismaService } from './prisma.service';
import { TodoDto } from '../dtos/todo.dto';
import { ApiError } from '../errors/apiError';

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
    const todoBefore = await this.prisma.todo.findUnique({
      where: {
        id: id,
      },
    });
    if (!todoBefore) {
      throw new ApiError('an unexpected error occured', 500);
    }
    const todo = await this.prisma.todo.update({
      where: {
        id: id,
        fk_community_id: communityId,
      },
      data: {
        name: name,
        done: done,
        description: description,
        doneDate: !todoBefore.done && done ? new Date(Date.now()) : undefined,
      },
      include: {
        creator: true,
      },
    });
    return new TodoDto(todo);
  }

  async delete(id: number, communityId: number): Promise<void> {
    await this.prisma.todo.delete({
      where: {
        id: id,
        fk_community_id: communityId,
      },
    });
    return;
  }

  async getOpenTodos(communityId: number): Promise<TodoDto[]> {
    const todos = await this.prisma.todo.findMany({
      where: {
        done: false,
        fk_community_id: communityId,
      },
      include: {
        creator: true,
      },
      orderBy: {
        creationDate: 'desc',
      },
    });
    const todosDto = todos.map((todo) => new TodoDto(todo));
    return todosDto;
  }

  async getDoneTodos(communityId: number): Promise<TodoDto[]> {
    const todos = await this.prisma.todo.findMany({
      where: {
        done: true,
        fk_community_id: communityId,
      },
      include: {
        creator: true,
      },
      orderBy: {
        doneDate: 'desc',
      },
    });
    const todosDto = todos.map((todo) => new TodoDto(todo));
    return todosDto;
  }
}
