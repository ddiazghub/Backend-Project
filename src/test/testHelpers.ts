import { expect } from "@jest/globals";
import request from "supertest";
import app from "../app";
import { generateJwtToken } from "../controllers/user.controller";
import { DisplayUserToken } from "../models/auth";
import { IDoc } from "../models/model";
import { IUser, MfaSecret } from "../models/user.model";

export function verifyUser(user: IUser) {
  const properties = [
    "email",
    "name",
    "lastName",
    "phone",
    "role",
    "birthday",
  ];

  for (const property of properties) {
    expect(user).toHaveProperty(property);
  }
}

export async function verifyUserCount(count: number = 4) {
  const response = await request(app)
    .get("/users")
    .set("Accept", "application/json");

  expect(response.status).toBe(200);
  expect(response.body.length).toBe(count);
}

export async function getUser(id: string) {
  const response = await request(app)
    .get(`/users/${id}`)
    .set("Accept", "application/json");

  expect(response.status).toBe(200);

  return response.body as IDoc<IUser>;
}

export async function login(
  email: string,
  password: string,
): Promise<DisplayUserToken | MfaSecret> {
  const url = encodeURI(`/users/login?email=${email}&password=${password}`);

  const response = await request(app)
    .get(url)
    .set("Accept", "application/json");

  expect(response.status).toBe(200);

  return response.body;
}

export async function userLogin(email: string, password: string) {
  const token = await login(email, password);
  expect(token).toHaveProperty("token");
  expect(token).toHaveProperty("user");

  return token as DisplayUserToken;
}

export async function adminLogin(email: string, password: string) {
  const properties = [
    "status",
    "secret",
    "uri",
    "qr",
    "updatedAt",
  ];

  const secret = (await login(email, password)) as MfaSecret & { _id: string };

  for (const property of properties) {
    expect(secret).toHaveProperty(property);
  }

  const user = await getUser(secret._id);

  return generateJwtToken(user);
}
