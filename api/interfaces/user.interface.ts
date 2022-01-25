import { ObjectId } from 'mongoose';
export interface IUser {
  _id: ObjectId,
  email: string,
  name: string,
  company: string,
  password: string,
  resetToken: string,
  role: 'admin' | 'company' | 'client',

  // Functions of Mongoose to make TypeScript not complain. Should see how I can have decent types of Mongoose itself...
  save: Function,
  get: Function,
}
