import { generateSecret } from "node-2fa";
import { EnumMap } from "../models/model";
import { IBaseUser, MfaSecret } from "../models/user.model";
import config from "../config";
import argon2 from "argon2";

export interface TestUser extends IBaseUser {
  role: string;
  mfaSecret?: MfaSecret;
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
