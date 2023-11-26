import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import { getUsers, setup, teardown } from "./setup";
import request from "supertest";
import app from "../app";
import { IUser, UserRole } from "../models/user.model";
import { TestUser } from "./data";
import { UserCreation } from "../docs/user.docs";
import { ReverseEnumMapping } from "../controllers/controller";

beforeAll(setup);
afterAll(teardown);

function verifyUser(user: IUser) {
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

async function verifyUserCount(count: number = 4) {
  const response = await request(app)
    .get("/users")
    .set("Accept", "application/json");

  expect(response.status).toBe(200);
  expect(response.body.length).toBe(count);
}

describe("Se testean las rutas  de usuarios", () => {
  test("Se obtienen todos los usuarios", async () => verifyUserCount(4));

  test("Se obtienen todos los roles", async () => {
    const response = await request(app)
      .get("/users/roles")
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    const set1 = new Set(UserRole.values);
    const roles = response.body as { name: string }[];
    const set2 = new Set(roles.map((role) => role.name));
    expect(set1).toEqual(set2);
  });

  test("Login usuario", async () => {
    const response = await request(app)
      .get("/users/login?email=user%40email.com&password=123456")
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("user");
    verifyUser(response.body.user);
  });

  test("Crear usuario", async () => {
    const Roles = ReverseEnumMapping(UserRole);
    const roles = await Roles();

    const user: UserCreation = {
      name: "david",
      lastName: "diaz",
      email: "david@email.com",
      password: "123456",
      phone: 60000000004,
      birthday: new Date("January 3, 1986 03:24:00"),
      role: roles["administrador"],
    };

    const response = await request(app)
      .post("/users")
      .set("Accept", "application/json")
      .send(user);

    expect(response.status).toBe(200);
    verifyUser(response.body);
    await verifyUserCount(5);
  });
});
