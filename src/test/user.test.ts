import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import { getUsers, setup, teardown } from "./setup";
import request from "supertest";
import app from "../app";
import { IUser, User, UserRole } from "../models/user.model";
import { UserCreation, UserToken } from "../docs/user.docs";
import { ReverseEnumMapping } from "../controllers/controller";
import { DisplayUserToken } from "../models/auth";

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

async function login(email: string, password: string) {
  const response = await request(app)
    .get(
      `/users/login?email=${encodeURI(email)}&password=${encodeURI(password)}`,
    )
    .set("Accept", "application/json");

  expect(response.status).toBe(200);

  return response.body as DisplayUserToken;
}

describe("User routes", () => {
  test("Get all users", async () => verifyUserCount(4));

  test("Get all roles", async () => {
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

  test("User login", async () => {
    const token = await login("user@email.com", "123456");

    expect(token).toHaveProperty("token");
    expect(token).toHaveProperty("user");
    verifyUser(token.user);
  });

  test("Create user", async () => {
    const Roles = ReverseEnumMapping(UserRole);
    const roles = await Roles();

    const user: UserCreation = {
      name: "david",
      lastName: "diaz",
      email: "david@email.com",
      password: "123456",
      phone: 60000000004,
      birthday: new Date("January 3, 1986 03:24:00"),
      role: roles["usuario"],
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

test("Get User by ID", async () => {
  const responseUsers = await request(app)
    .get("/users")
    .set("Accept", "application/json");

  const userId = responseUsers.body[0]._id;

  const response = await request(app)
    .get(`/users/${userId}`)
    .set("Accept", "application/json");

  expect(response.status).toBe(200);
});

test("Delete user", async () => {
  const email = "david@email.com";
  const password = "123456";
  const token = await login(email, password);

  const deleteRequest = (jwt: string = "") => {
    return request(app)
      .delete(`/users/${token.user._id}`)
      .set("Authorization", `Bearer ${jwt}`)
      .set("Accept", "application/json");
  };

  // Solicitud sin jwt. Debe fallar.
  const failed = await deleteRequest();
  expect(failed.status).toBe(500);

  // Solicitud con la jwt del usuario. Debe ejecutar el delete.
  const response = await deleteRequest(token.token);
  expect(response.status).toBe(200);

  await verifyUserCount(4);
});
