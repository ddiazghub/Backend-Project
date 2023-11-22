import config from "../config";
import { Router } from "express";

import {
  createOrder,
  deleteOrder,
  getStates,
  getOrder,
  getOrders,
  getUnconfirmed,
  updateOrder,
} from "../controllers/order.controller";
import { authByKey, authenticate } from "../middleware";
import { Order } from "../models/order.model";

const router = Router();
const authorize = authByKey(Order, "user");

router.get("/", getOrders);
router.get("/states", getStates);
router.get("/unconfirmed", getUnconfirmed);
router.get("/:id", getOrder);
router.post("/", authenticate, createOrder);
router.patch("/", authenticate, authorize.update, updateOrder);
router.delete("/:id", authenticate, authorize.delete, deleteOrder);

export default router;
