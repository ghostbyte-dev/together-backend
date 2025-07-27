import { inject, injectable } from 'tsyringe';
import { TodoService } from '../services/todo.service';
import type { NextFunction, Request, Response } from 'express';
import { resSend, ResStatus } from '../helper';
import { TodoDto } from '../dtos/todo.dto';

@injectable()
export class TodoController {
  constructor(@inject(TodoService) private todoService: TodoService) {}

  async create(req: Request, res: Response, next: NextFunction) {
    const { name, description } = req.body;
    if (!name) {
      resSend(res, null, ResStatus.ERROR, 'Invalid Data');
    }

    const userId = req.user.id;
    const communityId = req.user.communityId;

    try {
      const todo: TodoDto = await this.todoService.create(name, description, userId, communityId);
      resSend(res, todo);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { name, description, done, id } = req.body;
    if (!id) {
      resSend(res, null, ResStatus.ERROR, 'Invalid Data');
    }

    const communityId = req.user.communityId;

    try {
      const todo: TodoDto = await this.todoService.update(id, done, name, description, communityId);
      resSend(res, todo);
    } catch (error) {
      next(error);
    }
  }

  async getDone(req: Request, res: Response, next: NextFunction) {
    const communityId = req.user.communityId;

    try {
      const todos: TodoDto[] = await this.todoService.getTodos(true, communityId);
      resSend(res, todos);
    } catch (error) {
      next(error);
    }
  }

  async getOpen(req: Request, res: Response, next: NextFunction) {
    const communityId = req.user.communityId;

    try {
      const todos: TodoDto[] = await this.todoService.getTodos(false, communityId);
      resSend(res, todos);
    } catch (error) {
      next(error);
    }
  }
}
