import { Request, Response } from "express";
import { User, UserRole } from "../models/user.model";
import { ResourceController } from "./controller";
import argon2 from "argon2";

import errors from "../models/errors";

const user = new ResourceController(User, [["role", "name"]]);
const role = new ResourceController(UserRole);

export async function getUsers(req: Request, res: Response) {
  await user.getResources(req, res);
}

export async function getRoles(req: Request, res: Response) {
  await role.getAll(req, res);
}

export async function login(req: Request, res: Response) {
  const filters = { email: req.query.email, disabled: false };

  const user = await User.findOne(filters as object).populate({
    path: "role",
    select: "name",
  });

  if (user && await argon2.verify(user.passwordHash, req.query.password as string)) {
    res.status(200).json(user);
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
