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

const router = Router();

router.get("/", getOrders);
router.get("/states", getStates);
router.get("/:id", getOrder);
router.get("/unconfirmed", getUnconfirmed);
router.post("/", createOrder);
router.patch("/", updateOrder);
router.delete("/:id", deleteOrder);

export default router;
