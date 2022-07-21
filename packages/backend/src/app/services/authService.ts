import User from '../models/user';
import { IUser } from '../interfaces/user.interface';

export const generateToken = (): Promise<string> => {
    return new Promise((resolve) => {
        let resetToken = require('crypto').randomBytes(8).toString('hex')
        User.findOne({ resetToken: resetToken }, (err: any, user: IUser) => {
            if (!user) {
                return resolve(resetToken)
            } else {
                resolve(generateToken())
            }
        })
    })
}