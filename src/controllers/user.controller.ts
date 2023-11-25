import { Request, Response } from "express";
import {
  IUser,
  MfaSecret,
  MfaStatus,
  User,
  UserRole,
} from "../models/user.model";
import { ResourceController, ReverseEnumMapping } from "./controller";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { generateSecret, verifyToken } from "node-2fa";

import { IDoc, IDocument } from "../models/model";
import { DisplayUserToken, Token } from "../models/auth";
import config from "../config";
import { LoginFailed, Unauthorized } from "../models/errors";

const MS_IN_HOUR = 3600 * 1000;
const TEN_MINS = Math.round(MS_IN_HOUR / 6);

const user = new ResourceController(
  User,
  [["role", "name"]],
  removeCredentials,
);

const role = new ResourceController(UserRole);

const Roles = ReverseEnumMapping(UserRole);

async function removeCredentials(user: IDocument<IUser>) {
  const { passwordHash, mfaSecret: otp, ...usr } =
    (user as unknown as { _doc: IUser })._doc;

  return usr;
}

export async function getUsers(req: Request, res: Response) {
  await user.getResources(req, res);
}

export async function getRoles(req: Request, res: Response) {
  await role.getAll(req, res);
}

function generateJwtToken(user: IDoc<IUser>): DisplayUserToken {
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
    if (user.mfaSecret) {
      const newSecret = {
        ...(user.mfaSecret as unknown as { _doc: MfaSecret })._doc,
        updatedAt: new Date(),
        status: MfaStatus.Otp,
      };

      await User.findByIdAndUpdate(user._id, { mfaSecret: newSecret });
      res.status(200).json({ ...newSecret, _id: user._id });
    } else {
      const u = await removeCredentials(user) as IDoc<IUser>;
      const token = generateJwtToken(u);
      res.status(200).json(token);
    }
  } else {
    throw new LoginFailed();
  }
}

export async function mfaAuth(req: Request, res: Response) {
  const id = req.query.user as string;
  const token = req.query.token as string;
  const filters = { _id: id, disabled: false };

  const user = await User.findOne(filters as object).populate({
    path: "role",
    select: "name",
  });

  if (
    !user?.mfaSecret ||
    user.mfaSecret.status !== MfaStatus.Otp ||
    user.mfaSecret.updatedAt.getTime() < Date.now() - TEN_MINS
  ) {
    throw new Unauthorized();
  }

  if (verifyToken(user.mfaSecret.secret, token)?.delta !== 0) {
    throw new Unauthorized();
  }

  const newSecret = {
    ...(user.mfaSecret as unknown as { _doc: MfaSecret })._doc,
    updatedAt: new Date(),
    status: MfaStatus.Password,
  };

  await User.findByIdAndUpdate(id, { mfaSecret: newSecret });
  const u = await removeCredentials(user) as IDoc<IUser>;
  const jwtUser = generateJwtToken(u);

  res.status(200).json(jwtUser);
}

export async function getUser(req: Request, res: Response) {
  await user.getResource(req, res);
}

export async function register(req: Request, res: Response) {
  const roles = await Roles();
  const newUser = req.body as IUser;

  if (newUser.role.toString() == roles["administrador"].toString()) {
    newUser.mfaSecret = generateSecret({
      name: config.APP_NAME,
      account: newUser.email,
    }) as MfaSecret;
  }

  await user.createResource(req, res);
}

export async function updateUser(req: Request, res: Response) {
  await user.updateResource(req, res);
}

export async function deleteUser(req: Request, res: Response) {
  await user.deleteResource(req, res);
}
