import { NextFunction, Request, Response } from "express";
import argon2 from "argon2";

export async function hashPassword(req: Request, res: Response, next: NextFunction) {
  const password: string = req.body.password;
  delete req.body.password;
  const hash = await argon2.hash(password);
  req.body.passwordHash = hash;
  next();
}
