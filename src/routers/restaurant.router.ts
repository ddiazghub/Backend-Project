import { Router } from "express";
import {
  createRestaurant,
  deleteRestaurant,
  getCategories,
  getRestaurant,
  getRestaurants,
  updateRestaurant,
} from "../controllers/restaurant.controller";

const router = Router();

router.get("/", getRestaurants);
router.get("/categories", getCategories);
router.get("/:id", getRestaurant);
router.post("/", createRestaurant);
router.patch("/", updateRestaurant);
router.delete("/:id", deleteRestaurant);

export default router;
