import { inject, injectable } from "tsyringe";
import { PrismaService } from "./prismaService";

@injectable()
export class UserService {
    constructor(
        @inject(PrismaService) private prisma: PrismaService
    ) { }

    async getUser(userId: number) {
        console.log(userId)
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                communities: true
            }
        })
        console.log(user)
        return user;
    }
}