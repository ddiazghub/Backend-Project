import { Request, Response } from "express";
import { IUser, User, UserRole } from "../models/user.model";
import { ResourceController, ReverseEnumMapping } from "./controller";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

import { IDoc, IDocument } from "../models/model";
import { DisplayUserToken, Token } from "../models/auth";
import config from "../config";
import { LoginFailed } from "../models/errors";

const MS_IN_HOUR = 3600 * 1000;

const user = new ResourceController(
  User,
  [["role", "name"]],
  removeCredentials,
);

const role = new ResourceController(UserRole);

const Roles = ReverseEnumMapping(UserRole);

async function removeCredentials(user: IDocument<IUser>) {
  const { passwordHash, otp, ...usr } =
    (user as unknown as { _doc: IUser })._doc;

  return usr;
}

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
    admin: (user.role as unknown as { name: string }).name === "Administrador",
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
    const roles = await Roles();
    const roleName = (user.role as unknown as { name: string }).name
      .toLowerCase();

    if (roleName == roles["administrador"]) {
      // console.og("2fa time");
      const token = generateToken(user);
      res.status(200).json(token);
    } else {
      const token = generateToken(user);
      res.status(200).json(token);
    }
  } else {
    throw new LoginFailed();
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
