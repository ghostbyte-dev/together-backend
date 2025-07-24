import { PrismaClient } from '@prisma/client';
import { injectable, singleton } from 'tsyringe';

@injectable()
@singleton() // Ensure we use only ONE PrismaClient instance (singleton pattern)
export class PrismaService extends PrismaClient {
  constructor() {
    super();
    console.log('PrismaService initialized');
  }
}
