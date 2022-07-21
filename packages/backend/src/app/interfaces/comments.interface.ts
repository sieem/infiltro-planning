import { ObjectId } from "mongoose";

export interface IComment {
  _id: ObjectId,
  user: ObjectId,
  createdDateTime: Date,
  modifiedDateTime: Date,
  content: string,
}
