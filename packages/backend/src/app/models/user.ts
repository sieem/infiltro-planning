import { Schema, model } from 'mongoose';


class User extends Schema {
    constructor() {
        super({
            name: String,
            email: String,
            password: String,
            company: String,
            role: String,
            resetToken: String,
            activated: Boolean,
        })
    }
}

export default model('user', new User());

