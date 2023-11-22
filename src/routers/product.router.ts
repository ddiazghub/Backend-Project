import config from "../config";
import { Router } from "express";

import {
  createProduct,
  deleteProduct,
  getCategories,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/product.controller";

import { authenticate, isRestaurantAdmin } from "../middleware";
import { Product } from "../models/product.model";

const router = Router();
const authorize = isRestaurantAdmin(Product);

router.get("/", getProducts);
router.get("/categories", getCategories);
router.get("/:id", getProduct);
router.post("/", authenticate, authorize.create, createProduct);
router.patch("/", authenticate, authorize.update, updateProduct);
router.delete("/:id", authenticate, authorize.delete, deleteProduct);

export default router;
