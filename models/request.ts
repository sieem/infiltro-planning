import { Request as ExpressRequest } from 'express';
import { IUser } from '../interfaces/user.interface';
export interface Request extends ExpressRequest {
  user?: IUser,
  userId?: string;
}