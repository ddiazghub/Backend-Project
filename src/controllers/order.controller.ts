import { Request, Response } from "express";
import { ceilDate, setDifference } from "../helpers";
import { Product } from "../models/product.model";
import { IOrderProduct, Order, OrderState } from "../models/order.model";
import { EnumMapping, ResourceController } from "./controller";
import { HttpError } from "../models/errors";

const order = new ResourceController(Order, [["state", "name"]]);
const state = new ResourceController(OrderState);

const States = EnumMapping(OrderState);

export async function getOrders(req: Request, res: Response) {
  const empty = {};
  const user = req.query.user ? { user: req.query.user } : {};

  const restaurant = req.query.restaurant
    ? { restaurant: req.query.restaurant }
    : empty;

  const startDate = req.query.startDate ? { $gte: req.query.startDate } : empty;

  const endDate = req.query.endDate
    ? { $lte: ceilDate(new Date(req.query.endDate as string)) }
    : empty;

  const dateRange = startDate === empty && endDate === empty ? empty : { createdAt: { ...startDate, ...endDate } };
  const filters = { ...user, ...restaurant, ...dateRange };

  await order.getResources(req, res, filters);
}

export async function getUnconfirmed(req: Request, res: Response) {
  const filters = { state: (await States()).created };

  await order.getResources(req, res, filters);
}
export async function getStates(req: Request, res: Response) {
  await state.getAll(req, res);
}

export async function getOrder(req: Request, res: Response) {
  await order.getResource(req, res);
}

export async function createOrder(req: Request, res: Response) {
  const products = (req.body.products as IOrderProduct[]).map(product => product.product.toString());
  const prods = new Set(products);
  const validProducts = await Product.find({ _id: { $in: products } });
  const valid = new Set(validProducts.map((product) => product._id.toString()));
  const invalid = setDifference(prods, valid);

  if (invalid.size == 0) {
    await order.createResource(req, res);
  } else {
    const inv = [...invalid];

    const joined = inv.length == 1
      ? ` ${inv[0]} is`
      : `s ${[inv.slice(0, -1).join(", "), inv[inv.length - 1]].join(" and ")} are`;

    throw new HttpError(
      400,
      `Bad Request, product${joined} not in the restaurant's menu`,
    );
  }
}

export async function updateOrder(req: Request, res: Response) {
  await order.updateResource(req, res);
}

export async function deleteOrder(req: Request, res: Response) {
  await order.deleteResource(req, res);
}