import { Schema, model } from 'mongoose';


class Company extends Schema {
    constructor() {
        super({
            name: String,
            email: String,
            clientOf: String,
            pricePageVisible: Boolean,
        })
    }
}

export default model('company', new Company());

