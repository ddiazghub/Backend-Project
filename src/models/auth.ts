import { Request } from "express";
import { IDoc } from "./model";
import { IUser } from "./user.model";

export interface Token {
  sub: string;
  exp: number;
  admin: boolean;
}

export interface AuthRequest extends Request {
  token: Token;
}

export interface DisplayUserToken {
  user: IDoc<IUser>;
  token: string;
}
