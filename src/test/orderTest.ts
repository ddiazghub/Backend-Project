import app from "../app";
import request from "supertest";
import { describe, expect, test } from "@jest/globals";
import {
  createOrder,
  deleteOrder,
  getOrder,
  updateOrder,
  verifyOrderCount,
} from "./orderHelpers";
import { Order, OrderState } from "../models/order.model";
import { User } from "../models/user.model";
import { Restaurant } from "../models/restaurant.model";
import { OrderCreation, OrderUpdate } from "../docs/order.docs";
import { ReverseEnumMapping } from "../controllers/controller";
import { Product } from "../models/product.model";
import { userLogin } from "./userHelpers";

export default () => {
  describe("Order routes", () => {
    test("Get all orders", async () => verifyOrderCount(6));

    test("Get orders by user", async () => {
      const user = await User.findOne({ email: "user@email.com" });
      verifyOrderCount(4, `?user=${user?._id}`);
    });

    test("Get orders by restaurant", async () => {
      const restaurant = await Restaurant.findOne({ name: "Burger king" });
      verifyOrderCount(3, `?restaurant=${restaurant?._id}`);
    });

    test("Get orders by start date", async () =>
      verifyOrderCount(5, "?startDate=July 1, 2023 03:24:00"));

    test("Get orders by end date", async () =>
      verifyOrderCount(2, "?endDate=July 30, 2023 03:24:00"));

    test("Get orders by date range", async () =>
      verifyOrderCount(
        1,
        "?startDate=July 1, 2023 03:24:00&endDate=July 30, 2023 03:24:00",
      ));

    test("Get all states", async () => {
      const response = await request(app)
        .get("/orders/states")
        .set("Accept", "application/json");

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(OrderState.values.length);
      const set1 = new Set(OrderState.values);
      const states = response.body as { name: string }[];
      const set2 = new Set(states.map((state) => state.name));
      expect(set1).toEqual(set2);
    });

    test("Get unconfirmed orders", async () =>
      verifyOrderCount(1, "/unconfirmed"));

    test("Get Order by ID", async () => {
      const orders = await request(app)
        .get("/orders")
        .set("Accept", "application/json");

      const id = orders.body[0]._id;
      await getOrder(id);
    });

    test("Create order", async () => {
      const restaurant = Restaurant.findOne({ name: "Teriyaki" });
      const product = Product.findOne({ name: "Sushi" });

      const order: OrderCreation = {
        deliveryTime: new Date("November 30, 2023 03:24:00"),
        products: [
          {
            product: (await product)?._id?.toString() ?? "",
            quantity: 3,
          },
        ],
        restaurant: (await restaurant)?._id?.toString() ?? "",
      };

      const user = userLogin("user@email.com", "123456");
      const failed = createOrder(order, "");
      const response = await createOrder(order, (await user).token);

      expect((await failed).status).toBe(500);
      expect(response.status).toBe(200);
      await verifyOrderCount(7);
    });

    test("Update order", async () => {
      const States = ReverseEnumMapping(OrderState);
      const states = await States();

      const order = (await Order.findOne({
        deliveryTime: new Date("November 30, 2023 03:24:00"),
      }))!;

      const update: OrderUpdate = {
        _id: order._id.toString(),
        state: states["en curso"],
      };

      const user1 = userLogin("user@email.com", "123456");
      const user2 = userLogin("usuario@email.com", "123456");
      const failed1 = updateOrder(update, "");
      const failed2 = updateOrder(update, (await user2).token);
      const response = await updateOrder(update, (await user1).token);

      expect((await failed1).status).toBe(500);
      expect((await failed2).status).toBe(401);
      expect(response.status).toBe(200);

      const updated = await Order.find({ state: states["en curso"] });
      expect(updated.length).toBe(1);
    });

    test("Delete order", async () => {
      const States = ReverseEnumMapping(OrderState);
      const states = await States();
      const order = (await Order.findOne({ state: states["en curso"] }))!;
      const id = order._id.toString();

      const user1 = userLogin("user@email.com", "123456");
      const user2 = userLogin("usuario@email.com", "123456");
      const failed1 = deleteOrder(id, "");
      const failed2 = deleteOrder(id, (await user2).token);
      const response = await deleteOrder(id, (await user1).token);

      expect((await failed1).status).toBe(500);
      expect((await failed2).status).toBe(401);
      expect(response.status).toBe(200);
      await verifyOrderCount(6);
    });
  });
};
