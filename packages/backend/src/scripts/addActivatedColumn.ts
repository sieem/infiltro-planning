import { config } from 'dotenv';
import { IUser } from '../app/interfaces/user.interface';
import { connect } from 'mongoose';
import User from '../app/models/user';

(async () => {
    config();

    let users

    const db = process.env.NODE_ENV === 'development'
      ? `mongodb://localhost/${process.env.MONGODB_DB}`
      : `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@localhost:27017/${process.env.MONGODB_DB}`;
    connect(db, (err) => err ? console.log(err) : console.log('connected to mongodb'));

    try {
        users = await User.find({}) as unknown as IUser[];
    } catch (error: any) {
        console.error(error)
        return
    }

    console.log('start migration', new Date)

    for (const user of users) {
        user.activated = true;
        user.save();
    }

    console.log("done migration", new Date)
})()
