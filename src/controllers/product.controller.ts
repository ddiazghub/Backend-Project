import { Request, Response } from "express";
import { Product, ProductCategory } from "../models/product.model";
import { EnumMapping, ResourceController } from "./controller";

const product = new ResourceController(Product, [["category", "name"]]);
const category = new ResourceController(ProductCategory);

const Categories = EnumMapping(ProductCategory);

export async function getProducts(req: Request, res: Response) {
  const cats = await Categories();
  const restaurant = req.query.restaurant ? { restaurant: req.query.restaurant } : {};
  const category: { category?: string } = {};

  if (req.query.category)
    category.category = cats[(req.query.category as string).toLowerCase()] ?? req.query.category;

  await product.getResources(req, res, { ...category, ...restaurant });
}

export async function getCategories(req: Request, res: Response) {
  await category.getAll(req, res);
}

export async function getProduct(req: Request, res: Response) {
  await product.getResource(req, res);
}

export async function createProduct(req: Request, res: Response) {
  await product.createResource(req, res);
}

export async function updateProduct(req: Request, res: Response) {
  await product.updateResource(req, res);
}

export async function deleteProduct(req: Request, res: Response) {
  await product.deleteResource(req, res);
}
