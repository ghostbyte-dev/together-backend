import { inject, injectable } from 'tsyringe';
import { PrismaService } from './prisma.service';
import { TodoDto } from '../dtos/todo.dto';
import { ApiError } from '../errors/apiError';

@injectable()
export class FeedbackService {
  constructor(@inject(PrismaService) private prisma: PrismaService) {}

  async create(feedback: string, userId: number) {
    if (feedback.length <= 3) {
      throw new ApiError('Too short feedback, min length is 3 characters', 400);
    } else if (feedback.length >= 1000) {
      throw new ApiError('Too long feedback, max length is 1000 characters', 400);
    }
    await this.prisma.feedback.create({
      data: {
        content: feedback,
        fk_user_id: userId,
      },
    });
  }
}
