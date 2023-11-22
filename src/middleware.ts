import { NextFunction, Request, Response } from "express";
import argon2 from "argon2";
import { AuthRequest, Token } from "./models/auth";
import jwt from "jsonwebtoken";
import config from "./config";
import errors from "./models/errors";
import { User } from "./models/user.model";

export async function hashPassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const password: string = req.body.password;

  if (password) {
    delete req.body.password;
    const hash = await argon2.hash(password);
    req.body.passwordHash = hash;
  }

  next();
}

export async function auth(req: Request, res: Response, next: NextFunction) {
  const request = req as AuthRequest;
  const auth = req.header("Authorization");

  if (!auth) {
    throw errors.unauthorized;
  }

  const authParts = auth.split(" ");
  request.token = jwt.verify(authParts[authParts.length - 1], config.SECRET) as Token;
  const user = await User.findById(request.token.sub);

  if (!user) {
    throw errors.unauthorized;
  }

  request.user = user;
  next();
}
