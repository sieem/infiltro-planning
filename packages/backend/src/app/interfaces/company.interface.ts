import { ObjectId } from 'mongoose';
export interface ICompany {
  _id: ObjectId,
  email: string,
  name: string,
  clientOf: string;
  pricePageVisible: boolean,
}
