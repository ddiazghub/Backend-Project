import { describe, expect, test } from "@jest/globals";
import request, { Response } from "supertest";
import app from "../app";
import { adminLogin } from "./userHelpers";
import { Restaurant } from "../models/restaurant.model";
import { ReverseEnumMapping } from "../controllers/controller";
import { ProductCategory } from "../models/product.model";
import { ProductCreation } from "../docs/product.docs";
import { createProduct, deleteProductById, getProductById, getProducts2 } from "./productHelpers";


export default () => {
  describe("Products routes", () => {
    test("Get all Products", async () => {
      const response: Response = await getProducts2();
      expect(response.body.length).toBe(6);
    });

    test("Crear Producto", async () => {
      const Category = ReverseEnumMapping(ProductCategory);
      const cats = await Category();

      const admin2 = await adminLogin("admin2@email.com", "admin");
      const restaurant = await Restaurant.findOne({ name: "Teriyaki" });

      const product: ProductCreation = {
        name: "Sushi de camaron asado con chipotle y aguacate",
        description:
          "Sushi con ingredientes como el aguacate, chipotle y camaron asado",
        image:
          "https://www.cocinavital.mx/wp-content/uploads/2017/08/sushi-de-camaron-asado-con-chipotle-y-aguacate.jpg",
        category: cats["sushi"],
        restaurant: restaurant!._id.toString(),
        cost: 50,
      };

      const token: string = (await admin2).token;
      const response: Response = await createProduct(token, product);
      expect(response.status).toBe(200);
    });
    test("Editar Producto", async () => {
      const admin2 = adminLogin("admin2@email.com", "admin");

      const restaurant = await Restaurant.findOne({ name: "Teriyaki" });

      const response = await request(app)
        .get("/products")
        .set("Accept", "application/json");
      const productId = response.body[response.body.length - 1]._id; // Reemplaza con el ID real

      const updatedProduct = {
        _id: productId,
        name: "Sushi Latino",
        cost: 90,
      };

      const editResponse = await request(app)
        .patch("/products/")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${(await admin2).token}`)
        .send(updatedProduct);

      expect(editResponse.status).toBe(200);

      const updatedProductResponse = await request(app)
        .get(`/products/${productId}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${(await admin2).token}`);

      expect(updatedProductResponse.status).toBe(200);
      expect(updatedProductResponse.body.name).toBe("Sushi Latino");
      expect(updatedProductResponse.body.cost).toBe(90);
    });
  });

  test("Get products categories", async () => {
    const response: Response = await getProducts2();
    expect(response.statusCode).toBe(200);
    expect(response.body[0]).toHaveProperty("name");
    expect(response.body[0]).toHaveProperty("_id");
  });

  test("Get Product by ID", async () => {
    const productsResponse: Response = await getProducts2();
    const id: string = productsResponse.body[0]._id;
    const productByIdResponse: Response = await getProductById(id);
    expect(productByIdResponse.statusCode).toBe(200);
  });

  test("Delete Product by ID", async () => {
    const admin2 = await adminLogin("admin@email.com", "admin");
    const productsResponse: Response = await getProducts2();
    const id: string = productsResponse.body[0]._id;

    const deleteProductResponse: Response = await deleteProductById(
      (
        await admin2
      ).token,
      id
    );

    expect(deleteProductResponse.statusCode).toBe(200);

    const response: Response = await getProducts2();
    expect(response.body.length).toBe(6);
  });
};
