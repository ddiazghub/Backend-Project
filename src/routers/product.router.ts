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
import { auth } from "../middleware";

const router = Router();

router.get("/", getProducts);
router.get("/categories", getCategories);
router.get("/:id", getProduct);
router.post("/", auth, createProduct);
router.patch("/", auth, updateProduct);
router.delete("/:id", auth, deleteProduct);

export default router;
