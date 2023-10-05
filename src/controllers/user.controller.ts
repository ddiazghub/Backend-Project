import { Request, Response } from "express";
import { User, UserRole } from "../models/user.model";

export async function getUsers(req: Request, res: Response) {
  const limit = Number(req.query.limit ?? 0);
  const users = await User.find({ disabled: false })
    .limit(limit)
    .populate("role", "name");

  res.status(200).json(users);
}

export async function getRoles(req: Request, res: Response) {
  const roles = await UserRole.find();

  res.status(200).json(roles);
}

export async function login(req: Request, res: Response) {
  const filters = req.query as { email: string; password: string };
  const user = await User.findOne({ ...filters, disabled: false }).populate("role", "name");

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(401).json({
      status: 401,
      message: "Error: Incorrect email and/or password",
    });
  }
}
export async function getUser(req: Request, res: Response) {
  const user = await User.findOne({ _id: req.params.id, disabled: false }).populate("role", "name");

  if (user)
    res.status(200).json(user);
  else
    res.status(404).json({ status: 404, message: "Error: Not found" });
}

export async function register(req: Request, res: Response) {
  const user = await User.create(req.body);

  res.status(200).json(user);
}

export async function updateUser(req: Request, res: Response) {
  const id = req.body._id;
  delete req.body._id;
  delete req.body.disabled;

  const user = await User.findOneAndUpdate({ _id: id, disabled: false }, req.body, { new: true }).populate("role", "name");

  if (user)
    res.status(200).json(user);
  else
    res.status(404).json({ status: 404, message: "Error: Not found" });
}

export async function deleteUser(req: Request, res: Response) {
  const user = await User.findOneAndUpdate({ _id: req.params.id, disabled: false }, { disabled: true });

  if (user) {
    res.status(200).json({
      status: 200,
      message: "Message: The resource has been successfully deleted"
    });
  } else {
    res.status(404).json({ status: 404, message: "Error: Not found" });
  }
}
