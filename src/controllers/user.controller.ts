import { Request, Response } from "express";
import { User, UserRole } from "../models/user.model";
import { ResourceController } from "./controller";
import errors from "../models/errors";

const user = new ResourceController(User, [["role", "name"]]);
const role = new ResourceController(UserRole);

export async function getUsers(req: Request, res: Response) {
  await user.getResources(req, res, {});
}

export async function getRoles(req: Request, res: Response) {
  await role.getAll(req, res);
}

export async function login(req: Request, res: Response) {
  const filters = req.query as { email: string; password: string };
  await user.getResource(req, res, filters, errors.loginFailed);
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
