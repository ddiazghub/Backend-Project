import { Request } from "express";
import { IDoc } from "./model";
import { IUser } from "./user.model";

export interface Token {
  sub: string;
  exp: number;
}

export type AuthRequest = Request & { token: Token; user: IDoc<IUser> };

export interface UserToken {
  user: IDoc<IUser>;
  token: string;
}
