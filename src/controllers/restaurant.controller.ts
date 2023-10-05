import { Request, Response } from "express";
import { Restaurant, Location } from "../models/restaurant.model";

export async function getRestaurants(req: Request, res: Response) {
  const limit = Number(req.query.limit ?? 0);
  const users = await Restaurant.find({ disabled: false }).limit(limit);

  res.status(200).json(users);
}

export async function getLocations(req: Request, res: Response) {
  const limit = Number(req.query.limit ?? 0);
  const restaurant = req.query.restaurant;
  const filters = { ...(restaurant ? ({ restaurant }) : ({})), disabled: false };
  const locations = await Location.find(filters).limit(limit);

  res.status(200).json(locations);
}

export async function getRestaurant(req: Request, res: Response) {
  const user = await Restaurant.findOne({ _id: req.params.id, disabled: false }).populate("role", "name");

  if (user)
    res.status(200).json(user);
  else
    res.status(404).json({ status: 404, message: "Error: Not found" });
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
