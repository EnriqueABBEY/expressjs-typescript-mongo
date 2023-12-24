import { NextFunction, Request, Response } from "express";
import Jwt from "../helpers/jwt.helper";
import { InvalidToken, User } from "../models";

const authMiddleware = {
    async checkIfAuthenticated(req: Request, res: Response, next: NextFunction) {
        try {
            const token = Jwt.getAuthToken(req.headers.authorization);
            if (token) {
                const isTokenExpired = await InvalidToken.findOne({ token: token });
                if (isTokenExpired) {
                    throw Error('Session expired');
                } else {
                    const userId = Jwt.getAuthUserId(req.headers.authorization);
                    if (userId) {
                        const user = User.findById(userId);
                        if (user) {
                            next();
                        } else throw Error('Unauthorized');
                    } else throw Error('Unauthorized');
                }
            } else throw Error('Unauthorized');
        } catch (error) {
            res.status(401).json({ status: false, message: error.message });
        }
    }
}

export default authMiddleware;