import { Request, Response } from "express";
import { IUser, User, UserRole } from "../models/user.model";
import { ResourceController } from "./controller";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

import errors from "../models/errors";
import { IDoc } from "../models/model";
import { AuthRequest, DisplayUserToken, Token } from "../models/auth";
import config from "../config";

const MS_IN_HOUR = 3600 * 1000;
const user = new ResourceController(User, [["role", "name"]]);
const role = new ResourceController(UserRole);

export async function getUsers(req: Request, res: Response) {
  await user.getResources(req, res);
}

export async function getRoles(req: Request, res: Response) {
  await role.getAll(req, res);
}

function generateToken(user: IDoc<IUser>): DisplayUserToken {
  const payload: Token = {
    sub: user._id.toString(),
    exp: Date.now() + MS_IN_HOUR,
  };

  const token = jwt.sign(payload, config.SECRET);

  return { user, token };
}

export async function login(req: Request, res: Response) {
  const filters = { email: req.query.email, disabled: false };
  const password = req.query.password as string;

  const user = await User.findOne(filters as object).populate({
    path: "role",
    select: "name",
  });

  if (user && await argon2.verify(user.passwordHash, password)) {
    const token = generateToken(user);
    res.status(200).json(token);
  } else {
    throw errors.loginFailed;
  }
}

export async function getUser(req: Request, res: Response) {
  await user.getResource(req, res);
}

export async function register(req: Request, res: Response) {
  await user.createResource(req, res);
}

export async function updateUser(req: Request, res: Response) {
  await user.updateResource(req, res);
}

export async function deleteUser(req: Request, res: Response) {
  await user.deleteResource(req, res);
}
