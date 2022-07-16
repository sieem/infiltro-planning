import User from '../models/user';
import bcrypt from 'bcrypt';
import { sign, Secret } from 'jsonwebtoken';
import mailService from '../services/mailService';
import { generateToken } from '../services/authService';
import { config } from 'dotenv';
import { Response } from 'express';
import { Request } from 'models/request';
import { IUser } from '../interfaces/user.interface';
config();

const secretKey = process.env.SECRET_KEY as Secret;
const saltRounds = 10;

export const getUsers = async (req: Request, res: Response) => {
    const selectParameters = (req.user?.role === 'admin') ? { password: 0, resetToken: 0 } : { _id: 1, name: 1, company: 1 }

    try {
        const users = await User.find({ activated: true }).select(selectParameters).exec()
        return res.status(200).json(users)
    } catch (error: any) {
        console.error(error)
        return res.status(400).json(error.message)
    }
}

//unused for now
export const getUser = (req: Request, res: Response) => {
    User.findById(req.params.userId, (err: any, user: IUser) => {
        if (err) {
            console.error(err)
            return res.status(400).json(err.message)
        }

        if (!user.password) {
            return res.status(200).json(user)
        } else {
            return res.status(401).send('Unauthorized request')
        }
    })
}

export const getUserByResetToken = (req: Request, res: Response) => {
    User.findOne({ resetToken: req.params.resetToken}, (err: any, user: IUser) => {
        if (err) {
            console.error(err)
            return res.status(400).json(err.message)
        }

        if (!user) {
            return res.status(404).json('user not found');
        }

        return res.status(200).json(user._id)
    })
}

export const loginUser = (req: Request, res: Response) => {
    User.findOne({ email: req.body.email }, (err: any, user: IUser) => {
        if (err) {
            console.error(err)
            return res.status(400).json(err.message)
        }

        if (!user || !user.activated) {
            return res.status(401).send('Invalid Email')
        }

        bcrypt.compare(req.body.password, user.password, (err: any, compareValid) => {
            if (err) {
                console.error(err)
                return res.status(400).json(err.message)
            }
            if (!compareValid) {
                return res.status(401).send('Invalid Password')
            } else {
                let payload = { id: user._id, role: user.role, company: user.company }
                let token = sign(payload, secretKey);
                return res.status(200).send({ token })
            }
        });
    })
}

export const addUser = (req: Request, res: Response) => {
    if (req.user?.role === 'admin') {
        User.findOne({ email: req.body.email }, async (err: any, user: IUser) => {
            if (err) {
                console.error(err)
                return res.status(400).json(err.message)
            }
            if (user)
                return res.status(401).send('Email already exists')
            else {
                let user = new User(req.body) as unknown as IUser;
                user.resetToken = await generateToken();
                user.activated = true;

                user.save((err: any, user: IUser) => {
                    if (err) {
                        console.error(err)
                        return res.status(400).json(err.message)
                    }

                    const mail = new mailService({
                        from: '"Infiltro" <planning@infiltro.be>',
                        to: user.email,
                        subject: "Je bent toegevoegd op planning.infiltro.be",
                        text: `Gelieve je registratie af te ronden op ${process.env.BASE_URL}/registreer/${user.resetToken}`,
                        html: `Gelieve je registratie af te ronden op <a href="${process.env.BASE_URL}/registreer/${user.resetToken}">${process.env.BASE_URL}/registreer/${user.resetToken}</a>`
                    })
                    mail.send()

                    return res.status(200).send(user)
                })
            }
        })
    } else {
        return res.status(401).send('Unauthorized request')
    }
}

export const registerUser = (req: Request, res: Response) => {
    User.findById(req.body._id, (err: any, user: IUser) => {
        if (err) {
            console.error(err)
            return res.status(400).json(err.message)
        }

        user.password = req.body.password

        bcrypt.hash(user.password, saltRounds, (err: any, hash) => {
            if (err) {
                console.error(err)
                return res.status(400).json(err.message)
            }
            user.password = hash;
            user.resetToken = '';

            user.save((err: any, user: IUser) => {
                if (err) {
                    console.error(err)
                    return res.status(400).json(err.message)
                }

                let payload = { id: user._id, role: user.role, company: user.company }
                let token = sign(payload, secretKey);
                return res.status(200).send({ token })
            })
        })

    })
}



export const resetPassword = (req: Request, res: Response) => {
    User.findOne({ email: req.body.email }, async (err: any, user: IUser) => {
        if (err) {
            console.error(err)
            return res.status(400).json(err.message)
        }

        if (!user) return res.status(401).send('Unauthorized request: no user found with given email')

        user.resetToken = await generateToken();

        user.save((err: any, user: IUser) => {
            if (err) {
                console.error(err)
                return res.status(400).json(err.message)
            }

            let mail = new mailService({
                from: '"Infiltro" <planning@infiltro.be>',
                to: user.email,
                subject: "Wachtwoord reset aangevraagd",
                text: `Gelieve je wachtwoord te herstellen door naar volgende url te surfen: ${process.env.BASE_URL}/herstel-wachtwoord/${user.resetToken}`,
                html: `Gelieve je wachtwoord te herstellen door naar volgende url te surfen: <a href="${process.env.BASE_URL}/herstel-wachtwoord/${user.resetToken}">${process.env.BASE_URL}/herstel-wachtwoord/${user.resetToken}</a>`
            })
            mail.send()

            return res.status(200).json("")
        })
    })
}

export const editUser = (req: Request, res: Response) => {
    if (req.user?.role === 'admin') {
        let user = new User(req.body)
        User.findByIdAndUpdate(user._id, user, { upsert: true }, function (err: any, savedUser) {
            if (err) {
                console.error(err)
                return res.status(400).json(err.message)
            }

            return res.status(200).json(user)
        })
    } else {
        return res.status(401).send('Unauthorized request')
    }
}

export const removeUser = async (req: Request, res: Response) => {
    if (req.user?.role === 'admin') {
        try {
            await User.findByIdAndUpdate(req.params.userId, { activated: false }).exec();
            return res.json({ status: 'ok' });
        } catch (error: any) {
            console.error(error)
            return res.status(400).json(error.message)
        }
    } else {
        return res.status(401).send('Unauthorized request')
    }
}
