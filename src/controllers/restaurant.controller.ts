import { Request, Response } from "express";
import { Restaurant, RestaurantCategory } from "../models/restaurant.model";
import { EnumMapping, ResourceController } from "./controller";

const restaurant = new ResourceController(Restaurant, [["category", "name"]]);
const category = new ResourceController(RestaurantCategory);

const Categories = EnumMapping(RestaurantCategory);

export async function getRestaurants(req: Request, res: Response) {
  const cats = await Categories();
  const name = req.query.name ? { name: { $regex: req.query.name, $options: "i" } } : {};
  const category: { category?: string } = {};

  if (req.query.category)
    category.category = cats[(req.query.category as string).toLowerCase()] ?? req.query.category;

  await restaurant.getResources(req, res, { ...name, ...category });
}

export async function getCategories(req: Request, res: Response) {
  await category.getAll(req, res);
}

export async function getRestaurant(req: Request, res: Response) {
  await restaurant.getResource(req, res);
}

export async function createRestaurant(req: Request, res: Response) {
  await restaurant.createResource(req, res);
}

export async function updateRestaurant(req: Request, res: Response) {
  await restaurant.updateResource(req, res);
}

export async function deleteRestaurant(req: Request, res: Response) {
  await restaurant.deleteResource(req, res);
}
