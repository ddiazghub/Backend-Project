import { generateSecret } from "node-2fa";
import { EnumMap, IDoc } from "../models/model";
import { IBaseUser, IUser, MfaSecret } from "../models/user.model";
import config from "../config";
import argon2 from "argon2";

export interface TestUser extends IBaseUser {
  role: string;
  mfaSecret?: MfaSecret;
}

export interface TestRestaurant {
  name: string;
  disabled: boolean;
  administrator: string;
  category: string;
  deliveryTime: number;
}

export async function getInitialUsers(roles: EnumMap): Promise<TestUser[]> {
  return [
    {
      name: "admin",
      lastName: "admin",
      email: "admin@email.com",
      phone: 10000000001,
      birthday: new Date("December 17, 1995 03:24:00"),
      role: roles["administrador"],
      passwordHash: await argon2.hash("admin"),
      disabled: false,
      mfaSecret: generateSecret({
        name: config.APP_NAME,
        account: "admin@email.com",
      }) as MfaSecret,
    },
    {
      name: "admin2",
      lastName: "admin2",
      email: "admin2@email.com",
      phone: 10000000002,
      birthday: new Date("December 17, 2000 03:24:00"),
      role: roles["administrador"],
      passwordHash: await argon2.hash("admin"),
      disabled: false,
      mfaSecret: generateSecret({
        name: config.APP_NAME,
        account: "admin2@email.com",
      }) as MfaSecret,
    },
    {
      name: "user",
      lastName: "user",
      email: "user@email.com",
      phone: 10000000003,
      birthday: new Date("December 1, 2008 03:24:00"),
      role: roles["usuario"],
      passwordHash: await argon2.hash("123456"),
      disabled: false,
    },
    {
      name: "user2",
      lastName: "usuario",
      email: "usuario@email.com",
      phone: 10000000004,
      birthday: new Date("December 1, 1980 03:24:00"),
      role: roles["usuario"],
      passwordHash: await argon2.hash("123456"),
      disabled: false,
    },
  ];
}

export async function getInitialRestaurants(
  categories: EnumMap,
  users: IDoc<IUser>[],
): Promise<TestRestaurant[]> {
  const getUserByEmail = (email: string) => {
    return users.find((user) => user.email.toString().startsWith(email));
  };
  const admin1 = getUserByEmail("admin@")?._id as unknown as string;
  const admin2 = getUserByEmail("admin2")?._id as unknown as string;

  return [
    {
      name: "Mc Donalds",
      category: categories["comida rapida"],
      disabled: false,
      administrator: admin1,
      deliveryTime: 20,
    },
    {
      name: "Burger king",
      category: categories["comida rapida"],
      disabled: false,
      administrator: admin2,
      deliveryTime: 25,
    },
    {
      name: "Salvator's pizza",
      category: categories["italiano"],
      disabled: false,
      administrator: admin1,
      deliveryTime: 30,
    },
    {
      name: "Teriyaki",
      category: categories["asiatico"],
      disabled: false,
      administrator: admin2,
      deliveryTime: 40,
    },
  ];
}
