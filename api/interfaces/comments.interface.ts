import { ObjectId } from "mongoose";

export interface IComment {
  _id: ObjectId | any,
  user: string,
  createdDateTime: Date,
  modifiedDateTime: Date,
  content: string,
}
