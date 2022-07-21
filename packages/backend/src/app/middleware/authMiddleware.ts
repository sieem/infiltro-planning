import { verify, Secret } from 'jsonwebtoken';
import { config } from 'dotenv';
import User from '../models/user';
import { NextFunction, Response } from 'express';
import { Request } from '../models/request';
import { IUser } from '../interfaces/user.interface';
config();

const secretKey = process.env.SECRET_KEY as Secret;

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        return res.status(401).send('Unauthorized request')
    }
    const token = req.headers.authorization.split(' ')[1]
    if (token === 'null') {
        return res.status(401).send('Unauthorized request')
    }

    let payload: any = {};
    try {
        payload = verify(token, secretKey)
    } catch (error: any) {
        console.error(error);
        return res.status(401).send('Invalid Signature');
    }

    if (!payload) {
        return res.status(401).send('Unauthorized request')
    }

    req.userId = payload.id;
    next();
}

export const getUserDetails = (req: Request, res: Response, next: NextFunction) => {
    if (!req.userId) {
        next();
        return;
    }
    User.findById(req.userId, (err: any, user: IUser) => {
        if (err) {
            return res.status(400).json(err.message)
        }

        if (!user || !user.activated) {
          return res.status(401).send('User not found')
        }

        user.password = ""
        req.user = user
        return next();
    })
}
