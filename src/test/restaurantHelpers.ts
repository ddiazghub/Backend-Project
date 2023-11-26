import request from "supertest";
import app from "../app";
import { expect } from "@jest/globals";
import { ReverseEnumMapping } from "../controllers/controller";
import { IDoc } from "../models/model";
import { IRestaurant, RestaurantCategory } from "../models/restaurant.model";
import { IUser } from "../models/user.model";
import { TestRestaurant, getInitialRestaurants } from "./testData";

let restaurants: TestRestaurant[] | undefined;
  
export async function getRestaurants(users: IDoc<IUser>[] = []): Promise<TestRestaurant[]> {
  const Category = ReverseEnumMapping(RestaurantCategory);
  const categories = await Category();
  restaurants ??= await getInitialRestaurants(categories, users);

  return restaurants;
}

export async function verifyRestaurantCount(count: number = 4) {
  const response = await request(app)
    .get("/restaurants")
    .set("Accept", "application/json");

  expect(response.status).toBe(200);
  expect(response.body.length).toBe(count);
}

export function verifyRestaurant(restaurant: IRestaurant) {
  const properties = [
    "name",
    "category",
    "disabled",
    "administrator",
    "deliveryTime",
    "_id",
  ];

  for (const property of properties) {
    expect(restaurant).toHaveProperty(property);
  }
}

