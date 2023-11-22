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
import { auth } from "../middleware";

const router = Router();

router.get("/", getOrders);
router.get("/states", getStates);
router.get("/unconfirmed", getUnconfirmed);
router.get("/:id", getOrder);
router.post("/", auth, createOrder);
router.patch("/", auth, updateOrder);
router.delete("/:id", auth, deleteOrder);

export default router;
