import { inject, injectable } from "tsyringe";
import { UserService } from "../services/userService";
import helper from "../helper";
import { Request, Response } from "express";

@injectable()
export class UserController {
    constructor(@inject(UserService) private userService: UserService) { }

    async getUser(req: Request, res: Response) {
        const userId = req.user.id
        const user = await this.userService.getUser(userId);
        helper.resSend(res, user)
    }
}