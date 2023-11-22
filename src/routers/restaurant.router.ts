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
import { auth } from "../middleware";

const router = Router();

router.get("/", getRestaurants);
router.get("/categories", getCategories);
router.get("/:id", getRestaurant);
router.post("/", auth, createRestaurant);
router.patch("/", auth, updateRestaurant);
router.delete("/:id", auth, deleteRestaurant);

export default router;
