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

const router = Router();

router.get("/", getProducts);
router.get("/categories", getCategories);
router.get("/:id", getProduct);
router.post("/", createProduct);
router.patch("/", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
