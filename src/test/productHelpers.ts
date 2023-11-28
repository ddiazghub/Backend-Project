import { ReverseEnumMapping } from "../controllers/controller";
import { IDoc } from "../models/model";
import { ProductCategory } from "../models/product.model";
import { IRestaurant } from "../models/restaurant.model";
import { getInitialProducts, TestProduct } from "./testData";
import request, { Response } from "supertest";
import app from "../app";
import { ProductCreation } from "../docs/product.docs";
let products: TestProduct[] | undefined;

export async function getProducts(
  restaurants: IDoc<IRestaurant>[] = [],
): Promise<TestProduct[]> {
  const Category = ReverseEnumMapping(ProductCategory);
  const categories = await Category();
  products ??= await getInitialProducts(categories, restaurants);

  return products;

  
}

export const getProducts2 = async (): Promise<Response> => {
  const response: Response = await request(app)
    .get("/products")
    .set("Accept", "application/json");

  return response;
};

export const createProduct = async (
  adminToken: string,
  product: ProductCreation
): Promise<Response> => {
  const response: Response = await request(app)
    .post("/products")
    .set("Accept", "application/json")
    .set("Authorization", `Bearer ${adminToken}`)
    .send(product);

  return response;
};

export const editProduct = async (
  adminToken: string,
  productId: string,
  updatedProduct: { _id: string; name: string; cost: number }
): Promise<void> => {
  await request(app)
    .patch(`/products/${productId}`)
    .set("Accept", "application/json")
    .set("Authorization", `Bearer ${adminToken}`)
    .send(updatedProduct);
};

export const getProductById = async (productId: string): Promise<Response> => {
  const response: Response = await request(app)
    .get(`/products/${productId}`)
    .set("Accept", "application/json");

  return response;
};

export const deleteProductById = async (
  adminToken: string,
  productId: string
): Promise<Response> => {
  const response: Response = await request(app)
    .delete(`/products/${productId}`)
    .set("Accept", "application/json")
    .set("Authorization", `Bearer ${adminToken}`);

  return response;
};
