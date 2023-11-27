import mongoose from "mongoose";
import { seedEnum } from "../controllers/controller";
import { Order, OrderState } from "../models/order.model";
import { Product, ProductCategory } from "../models/product.model";
import { Restaurant, RestaurantCategory } from "../models/restaurant.model";
import { User, UserRole } from "../models/user.model";
import { getUsers } from "./userHelpers";
import { getRestaurants } from "./restaurantHelpers";
import { getProducts } from "./productHelpers";
import { getOrders } from "./orderHelpers";

const enums = [UserRole, RestaurantCategory, ProductCategory, OrderState];
const models = [...enums, User, Restaurant, Product, Order];

async function initialData() {
  const users = await getUsers();
  const dbUsers = await User.create(users);
  const restaurants = await getRestaurants(dbUsers);
  const dbRestaurants = await Restaurant.create(restaurants);
  const products = await getProducts(dbRestaurants);
  const dbProducts = await Product.create(products);
  const orders = await getOrders(dbUsers, dbRestaurants, dbProducts);
  await Order.create(orders);
}

async function deleteAll() {
  const promises = models.map(async (model) =>
    (model.deleteMany as (obj: object) => void)({})
  );

  await Promise.all(promises);
}

export async function teardown() {
  console.log("Disconnecting client");
  await deleteAll();
  await mongoose.disconnect();
}

export async function setup() {
  console.log("Starting connection to database");
  const CONNECTION_STRING = process.env.TEST_CONNECTION_STRING ?? "";
  await mongoose.connect(CONNECTION_STRING);
  await deleteAll();
  await Promise.all(enums.map(seedEnum));
  await initialData();
}
