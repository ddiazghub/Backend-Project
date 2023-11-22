import { Request, Response } from "express";
import { ceilDate, setDifference } from "../helpers";
import { Product } from "../models/product.model";
import {
  IDisplayOrder,
  IOrder,
  IOrderProduct,
  Order,
  OrderState,
} from "../models/order.model";
import { ResourceController, ReverseEnumMapping } from "./controller";
import { HttpError } from "../models/errors";
import { ObjectId } from "mongoose";
import { IDocument } from "../models/model";
import { AuthRequest } from "../models/auth";

const order = new ResourceController(Order, [["state", "name"]], orderTotal);
const state = new ResourceController(OrderState);

const States = ReverseEnumMapping(OrderState);

async function orderTotal(order: IDocument<IOrder>): Promise<IDisplayOrder> {
  const products = await Product.find(
    { _id: { $in: order.products.map((p) => p.product) } },
    "_id cost",
  );

  const prods = new Map(products.map((p) => [p._id.toString(), p.cost]));

  const total = order.products.reduce(
    (acc, product) => {
      const cost = prods.get(product.product.toString());

      return cost ? acc + product.quantity * cost! : 0;
    },
    0,
  );

  const ord = {
    ...(order as unknown as { _doc: IDocument<IOrder> })._doc,
    total,
  };

  return ord;
}

export async function getOrders(
  req: Request,
  res: Response,
  extraFilters: object = {},
) {
  const empty = {};
  const user = req.query.user ? { user: req.query.user } : {};

  const restaurant = req.query.restaurant
    ? { restaurant: req.query.restaurant }
    : empty;

  const startDate = req.query.startDate ? { $gte: req.query.startDate } : empty;

  const endDate = req.query.endDate
    ? { $lte: ceilDate(new Date(req.query.endDate as string)) }
    : empty;

  const dateRange = startDate === empty && endDate === empty
    ? empty
    : { createdAt: { ...startDate, ...endDate } };
  const filters = { ...user, ...restaurant, ...dateRange, ...extraFilters };

  await order.getResources(req, res, filters);
}

export async function getUnconfirmed(req: Request, res: Response) {
  await getOrders(req, res, { state: (await States()).creado });
}

export async function getStates(req: Request, res: Response) {
  await state.getAll(req, res);
}

export async function getOrder(req: Request, res: Response) {
  await order.getResource(req, res);
}

export async function createOrder(req: Request, res: Response) {
  const request = req as AuthRequest;
  const body = req.body as IOrder;

  body.user = request.user._id as unknown as ObjectId;

  const products = (body.products as IOrderProduct[]).map((product) =>
    product.product.toString()
  );

  const prods = new Set(products);

  const validProducts = await Product.find({
    _id: { $in: products },
    restaurant: body.restaurant,
  });

  const valid = new Set(validProducts.map((product) => product._id.toString()));
  const invalid = setDifference(prods, valid);

  if (invalid.size == 0) {
    body.state = (await States()).creado as unknown as ObjectId;

    await order.createResource(req, res);
  } else {
    const inv = [...invalid];

    const joined = inv.length == 1
      ? ` ${inv[0]} is`
      : `s ${
        [inv.slice(0, -1).join(", "), inv[inv.length - 1]].join(" and ")
      } are`;

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
