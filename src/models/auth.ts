import { Request } from "express";
import { IDoc, IResource } from "./model";
import { IUser } from "./user.model";

export interface Token {
  sub: string;
  exp: number;
}

export interface IAuthUser extends IResource {
  lastName: string;
  email: string;
  passwordHash: string;
  phone: number;
  birthday: Date;
  admin: boolean;
}

export interface AuthRequest extends Request {
  token: Token;
  user: IDoc<IAuthUser>;
}

export interface DisplayUserToken {
  user: IDoc<IUser>;
  token: string;
}
