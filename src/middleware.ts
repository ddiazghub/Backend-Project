import { NextFunction, Request, Response } from "express";
import argon2 from "argon2";
import { AuthRequest, Token } from "./models/auth";
import jwt from "jsonwebtoken";
import config from "./config";
import { IDoc, IModel } from "./models/model";
import { ObjectId } from "mongoose";
import { IRestaurant, Restaurant } from "./models/restaurant.model";
import { NotFound, Unauthorized } from "./models/errors";

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
    throw new Unauthorized();
  }

  const authParts = auth.split(" ");

  request.token = jwt.verify(
    authParts[authParts.length - 1],
    config.SECRET,
  ) as Token;

  next();
}

export async function isAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const request = req as AuthRequest;

  if (!request.token.admin) {
    throw new Unauthorized();
  }

  next();
}

async function restaurantAdmin<T extends { restaurant: ObjectId }>(
  model: IModel<T>,
  userId: string,
  resourceId: string,
  next: NextFunction,
) {
  const doc = await model.findById(resourceId).populate({
    path: "restaurant",
    select: "administrator",
  }) as T & { restaurant: IRestaurant };

  if (!doc) {
    throw new NotFound();
  }

  if (String(doc.restaurant.administrator) != String(userId)) {
    throw new Unauthorized();
  }

  next();
}

export function isRestaurantAdmin<T extends { restaurant: ObjectId }>(
  model: IModel<T>,
) {
  return {
    create: async (req: Request, res: Response, next: NextFunction) => {
      return authorizeByKey(
        Restaurant,
        "administrator",
        (req as AuthRequest).token.sub,
        req.body.restaurant,
        next,
      );
    },
    update: async (req: Request, res: Response, next: NextFunction) => {
      return restaurantAdmin(
        model,
        (req as AuthRequest).token.sub,
        req.body._id,
        next,
      );
    },
    delete: async (req: Request, res: Response, next: NextFunction) => {
      return restaurantAdmin(
        model,
        (req as AuthRequest).token.sub,
        req.params.id,
        next,
      );
    },
  };
}

async function authorizeByKey<T>(
  model: IModel<T>,
  key: keyof IDoc<T>,
  userId: string,
  resourceId: string,
  next: NextFunction,
) {
  const doc = await model.findById(resourceId);

  if (!doc) {
    throw new NotFound();
  }

  if (String(doc[key]) != String(userId)) {
    throw new Unauthorized();
  }

  next();
}

export function authByKey<T>(model: IModel<T>, key: keyof IDoc<T>) {
  return {
    update: async (req: Request, res: Response, next: NextFunction) => {
      return authorizeByKey(
        model,
        key,
        (req as AuthRequest).token.sub,
        req.body._id,
        next,
      );
    },
    delete: async (req: Request, res: Response, next: NextFunction) => {
      return authorizeByKey(
        model,
        key,
        (req as AuthRequest).token.sub,
        req.params.id,
        next,
      );
    },
  };
}
