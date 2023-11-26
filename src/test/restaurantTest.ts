import app from "../app";
import request from "supertest";
import { describe, expect, test } from "@jest/globals";
import { createRestaurant, verifyRestaurant, verifyRestaurantCount } from "./restaurantHelpers";
import { RestaurantCategory } from "../models/restaurant.model";
import { ReverseEnumMapping } from "../controllers/controller";
import { RestaurantCreation } from "../docs/restaurant.docs";
import { adminLogin, userLogin } from "./userHelpers";

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
      const user = await userLogin("user@email.com", "123456");
      const failed1 = createRestaurant(restaurant, "");
      const failed2 = createRestaurant(restaurant, user.token);
      const  response = await createRestaurant(restaurant, admin.token);

      expect((await failed1).status).toBe(500);
      expect((await failed2).status).toBe(401);
      expect(response.status).toBe(200);
      verifyRestaurant(response.body);
      await verifyRestaurantCount(5);
    });
  });
};
