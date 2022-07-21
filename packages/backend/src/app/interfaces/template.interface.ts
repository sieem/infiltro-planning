import { ObjectId } from 'mongoose';
export interface ITemplate {
  _id: ObjectId,
  name: string,
  body: string,
  subject: string,
}
