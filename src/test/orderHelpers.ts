import app from "../app";
import request from "supertest";
import { ReverseEnumMapping } from "../controllers/controller";
import { IDoc } from "../models/model";
import { IOrder, OrderState } from "../models/order.model";
import { IProduct } from "../models/product.model";
import { IRestaurant } from "../models/restaurant.model";
import { IUser } from "../models/user.model";
import { TestOrder, getInitialOrders } from "./testData";
import { expect } from "@jest/globals";
import { OrderCreation, OrderUpdate } from "../docs/order.docs";

let orders: TestOrder[] | undefined;

export async function getOrders(
  users: IDoc<IUser>[],
  restaurants: IDoc<IRestaurant>[],
  products: IDoc<IProduct>[],
): Promise<TestOrder[]> {
  const Category = ReverseEnumMapping(OrderState);
  const categories = await Category();
  orders ??= await getInitialOrders(categories, users, restaurants, products);

  return orders;
}

export async function verifyOrderCount(count: number, query: string = "") {
  const response = await request(app)
    .get(encodeURI(`/orders${query}`))
    .set("Accept", "application/json");

  expect(response.status).toBe(200);
  expect(response.body.length).toBe(count);
}

export async function getOrder(id: string) {
  const response = await request(app)
    .get(`/orders/${id}`)
    .set("Accept", "application/json");

  expect(response.status).toBe(200);

  return response.body as IDoc<IOrder>;
}

export async function createOrder(
  order: OrderCreation,
  token: string,
) {
  const response = await request(app)
    .post("/orders")
    .set("Accept", "application/json")
    .set("Authorization", `Bearer ${token}`)
    .send(order);

  return response;
}

export async function updateOrder(
  order: OrderUpdate,
  token: string,
) {
  const response = await request(app)
    .patch("/orders")
    .set("Accept", "application/json")
    .set("Authorization", `Bearer ${token}`)
    .send(order);

  return response;
}

export async function deleteOrder(
  id: string,
  token: string,
) {
  const response = await request(app)
    .delete(`/orders/${id}`)
    .set("Accept", "application/json")
    .set("Authorization", `Bearer ${token}`);

  return response;
}
