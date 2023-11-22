import config from "../config";
import { Router } from "express";

import {
  createRestaurant,
  deleteRestaurant,
  getCategories,
  getRestaurant,
  getRestaurants,
  updateRestaurant,
} from "../controllers/restaurant.controller";
import { authByKey, authenticate, isAdmin } from "../middleware";
import { Restaurant } from "../models/restaurant.model";

const router = Router();
const authorize = authByKey(Restaurant, "administrator");

router.get("/", getRestaurants);
router.get("/categories", getCategories);
router.get("/:id", getRestaurant);
router.post("/", authenticate, isAdmin, createRestaurant);
router.patch("/", authenticate, authorize.update, updateRestaurant);
router.delete("/:id", authenticate, authorize.delete, deleteRestaurant);

export default router;
