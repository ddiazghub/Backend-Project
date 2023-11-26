import mongoose from "mongoose";
import { seedEnum } from "../controllers/controller";
import { Order, OrderState } from "../models/order.model";
import { Product, ProductCategory } from "../models/product.model";
import { Restaurant, RestaurantCategory } from "../models/restaurant.model";
import { User, UserRole } from "../models/user.model";
import { getUsers } from "./userHelpers";
import { getRestaurants } from "./restaurantHelpers";

const enums = [UserRole, RestaurantCategory, ProductCategory, OrderState];
const models = [...enums, User, Restaurant, Product, Order];

async function initialData() {
  const users = await getUsers();
  const dbUsers = await User.create(users);
  const restaurants = await getRestaurants(dbUsers);
  const dbRestaurants = await Restaurant.create(restaurants);
}

export async function teardown() {
  const promises = models.map(async (model) =>
    (model.deleteMany as (obj: object) => void)({})
  );

  await Promise.all(promises);
}

export async function setup() {
  const CONNECTION_STRING = process.env.TEST_CONNECTION_STRING ?? "";
  await mongoose.connect(CONNECTION_STRING);
  await teardown();
  await Promise.all(enums.map(seedEnum));
  await initialData();
}
