import app from "../app";
import request from "supertest";
import { describe, expect, test } from "@jest/globals";
import { verifyRestaurant, verifyRestaurantCount } from "./restaurantHelpers";
import { RestaurantCategory } from "../models/restaurant.model";
import { ReverseEnumMapping } from "../controllers/controller";
import { RestaurantCreation } from "../docs/restaurant.docs";
import { adminLogin } from "./userHelpers";

export default () => {
  describe("Restaurant routes", () => {
    test("Get all restaurants", async () => verifyRestaurantCount(4));

    test("Get all categories", async () => {
      const response = await request(app)
        .get("/restaurants/categories")
        .set("Accept", "application/json");

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(RestaurantCategory.values.length);
      const set1 = new Set(RestaurantCategory.values);
      const categories = response.body as { name: string }[];
      const set2 = new Set(categories.map((category) => category.name));
      expect(set1).toEqual(set2);
    });

    test("Create restaurant", async () => {
      const Category = ReverseEnumMapping(RestaurantCategory);
      const cats = await Category();

      const restaurant: RestaurantCreation = {
        name: "Popsy",
        category: cats["postres"],
        deliveryTime: 15,
      };

      const admin = await adminLogin("admin@email.com", "admin");

      const response = await request(app)
        .post("/restaurants")
        .set("Accept", "application/json")
        .set("Authorization",`Bearer ${admin.token}`)
        .send(restaurant);

      expect(response.status).toBe(200);
      verifyRestaurant(response.body);
      await verifyRestaurantCount(5);
    });
  });
};
