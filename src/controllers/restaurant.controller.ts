import { Request, Response } from "express";
import {
  IDisplayRestaurant,
  IRestaurant,
  Restaurant,
  RestaurantCategory,
} from "../models/restaurant.model";
import { EnumMapping, ResourceController } from "./controller";
import { IDocument } from "../models/model";
import { Order } from "../models/order.model";

const restaurant = new ResourceController(
  Restaurant,
  [["category", "name"]],
  salesRating,
  (data) => data.sort((a, b) => b.sales - a.sales),
);

const category = new ResourceController(RestaurantCategory);

const Categories = EnumMapping(RestaurantCategory);

async function salesRating(
  restaurant: IDocument<IRestaurant>,
): Promise<IDisplayRestaurant> {
  const orders = await Order.find(
    { restaurant: restaurant._id },
    "orderRating",
  );

  const [popularity, ratingSum] = orders.reduce(([count, sum], order) => {
    if (order.orderRating) {
      return [count + 1, sum + order.orderRating];
    } else {
      return [count, sum];
    }
  }, [0, 0]);

  const rest = {
    ...(restaurant as unknown as { _doc: IDocument<IRestaurant> })._doc,
    sales: popularity,
    rating: popularity > 0 ? ratingSum / popularity : null,
  };

  return rest;
}

export async function getRestaurants(req: Request, res: Response) {
  const cats = await Categories();
  const name = req.query.name
    ? { name: { $regex: req.query.name, $options: "i" } }
    : {};
  const category: { category?: string } = {};

  if (req.query.category) {
    category.category = cats[(req.query.category as string).toLowerCase()] ??
      req.query.category;
  }

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
