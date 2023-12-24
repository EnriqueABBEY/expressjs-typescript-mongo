import { Request, Response } from "express";
import { InvalidToken, User } from "../models";
import * as bcrypt from 'bcrypt';
import Jwt from "../helpers/jwt.helper";

export async function login(req: Request, res: Response) {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });
        if (user) {
            const passwordIsValid = await bcrypt.compare(password, user.password);
            if (passwordIsValid) {
                const token = Jwt.generateTokenForUser({ id: user.id });
                res.json({
                    status: true, user: {
                        id: user._id,
                        lastname: user.lastname,
                        firstname: user.firstname,
                        username: user.username,
                        email: user.email,
                        picture: user.picture,
                        bio: user.bio,
                    }, access_token: token
                });
            } else res.status(422).json({ status: false, errors: { email: ['Invalid email or password'] } });
        } else res.status(422).json({ status: false, errors: { email: ['Invalid email or password'] } });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}

export async function register(req: Request, res: Response) {
    try {
        const { username, lastname, firstname, password, email } = req.body;
        const user = await User.create({ username, lastname, firstname, password, email });
        res.json({ status: true, user: user });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}

export async function logout(req: Request, res: Response) {
    try {
        const token = Jwt.getAuthToken(req.headers.authorization);
        await InvalidToken.create({ token: token });
        res.json({ status: true });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}