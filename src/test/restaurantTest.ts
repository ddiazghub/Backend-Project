import app from "../app";
import request from "supertest";
import { describe, expect, test } from "@jest/globals";
import {
  createRestaurant,
  deleteRestaurant,
  getRestaurant,
  updateRestaurant,
  verifyRestaurant,
  verifyRestaurantCount,
} from "./restaurantHelpers";
import { Restaurant, RestaurantCategory } from "../models/restaurant.model";
import { ReverseEnumMapping } from "../controllers/controller";
import { RestaurantCreation, RestaurantUpdate } from "../docs/restaurant.docs";
import { adminLogin, userLogin } from "./userHelpers";

export default () => {
  describe("Restaurant routes", () => {
    test("Get all restaurants", async () => verifyRestaurantCount(4));

    test("Get restaurants by name", async () =>
      verifyRestaurantCount(1, "name=burger"));

    test("Get restaurants by category", async () =>
      verifyRestaurantCount(1, "category=asiatico"));

    test("Get restaurants by name and category", async () =>
      verifyRestaurantCount(1, "name=mc&category=comida rapida"));

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

    test("Get Restaurant by ID", async () => {
      const restaurants = await request(app)
        .get("/restaurants")
        .set("Accept", "application/json");

      const id = restaurants.body[0]._id;
      await getRestaurant(id);
    });

    test("Create restaurant", async () => {
      const Category = ReverseEnumMapping(RestaurantCategory);
      const cats = await Category();

      const restaurant: RestaurantCreation = {
        name: "Popsy",
        category: cats["postres"],
        deliveryTime: 15,
      };

      const admin = adminLogin("admin@email.com", "admin");
      const user = userLogin("user@email.com", "123456");
      const failed1 = createRestaurant(restaurant, "");
      const failed2 = createRestaurant(restaurant, (await user).token);
      const response = await createRestaurant(restaurant, (await admin).token);

      expect((await failed1).status).toBe(500);
      expect((await failed2).status).toBe(401);
      expect(response.status).toBe(200);
      verifyRestaurant(response.body);
      await verifyRestaurantCount(5);
    });

    test("Update restaurant", async () => {
      const restaurant = (await Restaurant.findOne({ name: "Popsy" }))!;

      const update: RestaurantUpdate = {
        _id: restaurant._id.toString(),
        name: "Popsy Helados",
      };

      const admin1 = adminLogin("admin@email.com", "admin");
      const admin2 = adminLogin("admin2@email.com", "admin");
      const failed1 = updateRestaurant(update, "");
      const failed2 = updateRestaurant(update, (await admin2).token);
      const response = await updateRestaurant(update, (await admin1).token);

      expect((await failed1).status).toBe(500);
      expect((await failed2).status).toBe(401);
      expect(response.status).toBe(200);

      const updated = await Restaurant.findOne({ name: "Popsy Helados" });
      expect(updated ?? undefined).toBeDefined();
    });

    test("Delete restaurant", async () => {
      const restaurant = (await Restaurant.findOne({ name: "Popsy Helados" }))!;
      const id = restaurant._id.toString();

      const admin1 = adminLogin("admin@email.com", "admin");
      const admin2 = adminLogin("admin2@email.com", "admin");
      const failed1 = deleteRestaurant(id, "");
      const failed2 = deleteRestaurant(id, (await admin2).token);
      const response = await deleteRestaurant(id, (await admin1).token);

      expect((await failed1).status).toBe(500);
      expect((await failed2).status).toBe(401);
      expect(response.status).toBe(200);
      await verifyRestaurantCount(4);
    });
  });
};
