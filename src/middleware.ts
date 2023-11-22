import { NextFunction, Request, Response } from "express";
import argon2 from "argon2";
import { AuthRequest, Token } from "./models/auth";
import jwt from "jsonwebtoken";
import config from "./config";
import errors from "./models/errors";
import { User } from "./models/user.model";
import { IDoc, IModel } from "./models/model";
import { ObjectId } from "mongoose";
import { IRestaurant, Restaurant } from "./models/restaurant.model";

export async function hashPassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const password: string = req.body.password;

  if (password) {
    delete req.body.password;
    const hash = await argon2.hash(password);
    req.body.passwordHash = hash;
  }

  next();
}

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const request = req as AuthRequest;
  const auth = req.header("Authorization");

  if (!auth) {
    throw errors.unauthorized;
  }

  const authParts = auth.split(" ");

  request.token = jwt.verify(
    authParts[authParts.length - 1],
    config.SECRET,
  ) as Token;

  const doc = await User.findById(request.token.sub).populate({
    path: "role",
    select: "name",
  });

  if (!doc) {
    throw errors.unauthorized;
  }

  const userRole = doc.role as unknown as { name: string };

  const { role, ...user } = {
    ...doc,
    admin: userRole.name.toLowerCase().startsWith("admin"),
  };

  request.user = user;
  next();
}

export async function isAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const request = req as AuthRequest;

  if (!request.user.admin) {
    throw errors.unauthorized;
  }

  next();
}

async function restaurantAdmin<T extends { restaurant: ObjectId }>(
  model: IModel<T>,
  userId: object,
  resourceId: string,
  next: NextFunction,
) {
  const doc = await model.findById(resourceId).populate({
    path: "restaurant",
    select: "administrator",
  }) as T & { restaurant: IRestaurant };

  if (!doc) {
    throw errors.notFound;
  }

  if (String(doc.restaurant.administrator) != String(userId)) {
    throw errors.unauthorized;
  }

  next();
}

export function isRestaurantAdmin<T extends { restaurant: ObjectId }>(model: IModel<T>) {
  return {
    create: async (req: Request, res: Response, next: NextFunction) => {
      return authorizeByKey(
        Restaurant,
        "administrator",
        (req as AuthRequest).user._id,
        req.body.restaurant,
        next,
      );
    },
    update: async (req: Request, res: Response, next: NextFunction) => {
      return restaurantAdmin(
        model,
        (req as AuthRequest).user._id,
        req.body._id,
        next,
      );
    },
    delete: async (req: Request, res: Response, next: NextFunction) => {
      return restaurantAdmin(
        model,
        (req as AuthRequest).user._id,
        req.params.id,
        next,
      );
    },
  };
}

async function authorizeByKey<T>(
  model: IModel<T>,
  key: keyof IDoc<T>,
  userId: object,
  resourceId: string,
  next: NextFunction,
) {
  const doc = await model.findById(resourceId);

  if (!doc) {
    throw errors.notFound;
  }

  if (String(doc[key]) != String(userId)) {
    throw errors.unauthorized;
  }

  next();
}

export function authByKey<T>(model: IModel<T>, key: keyof IDoc<T>) {
  return {
    update: async (req: Request, res: Response, next: NextFunction) => {
      return authorizeByKey(
        model,
        key,
        (req as AuthRequest).user._id,
        req.body._id,
        next,
      );
    },
    delete: async (req: Request, res: Response, next: NextFunction) => {
      return authorizeByKey(
        model,
        key,
        (req as AuthRequest).user._id,
        req.params.id,
        next,
      );
    },
  };
}
