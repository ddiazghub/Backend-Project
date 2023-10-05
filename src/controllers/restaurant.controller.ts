import { Request, Response } from "express";
import { Restaurant, RestaurantCategory } from "../models/restaurant.model";

export async function getRestaurants(req: Request, res: Response) {
  const limit = Number(req.query.limit ?? 0);
  const nameFilter = req.query.name ? { name: { $regex: req.query.name, $options: "i" } } : {};
  const categoryFilter = req.query.category ? { category: req.query.category } : {};

  const users = await Restaurant.find({ ...nameFilter, ...categoryFilter, disabled: false })
    .limit(limit)
    .populate("category", "name");

  res.status(200).json(users);
}

export async function getCategories(req: Request, res: Response) {
  const categories = await RestaurantCategory.find();

  res.status(200).json(categories);
}

/*
export async function getLocations(req: Request, res: Response) {
  const limit = Number(req.query.limit ?? 0);
  const restaurant = req.query.restaurant;
  const filters = { ...(restaurant ? ({ restaurant }) : ({})), disabled: false };
  const locations = await Location.find(filters).limit(limit);

  res.status(200).json(locations);
}
*/

export async function getRestaurant(req: Request, res: Response) {
  const restaurant = await Restaurant.findOne({ _id: req.params.id, disabled: false })
    .populate("category", "name");

  if (restaurant)
    res.status(200).json(restaurant);
  else
    res.status(404).json({ status: 404, message: "Error: Not found" });
}

export async function createRestaurant(req: Request, res: Response) {
  const restaurant = await Restaurant.create(req.body);

  res.status(200).json(restaurant);
}

export async function updateRestaurant(req: Request, res: Response) {
  const id = req.body._id;
  delete req.body._id;
  delete req.body.disabled;

  const restaurant = await Restaurant.findOneAndUpdate({ _id: id, disabled: false }, req.body, { new: true })
    .populate("category", "name");

  if (restaurant)
    res.status(200).json(restaurant);
  else
    res.status(404).json({ status: 404, message: "Error: Not found" });
}

export async function deleteRestaurant(req: Request, res: Response) {
  const restaurant = await Restaurant.findOneAndUpdate({ _id: req.params.id, disabled: false }, { disabled: true });

  if (restaurant) {
    res.status(200).json({
      status: 200,
      message: "Message: The resource has been successfully deleted"
    });
  } else {
    res.status(404).json({ status: 404, message: "Error: Not found" });
  }
}
