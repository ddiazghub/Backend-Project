import { ReverseEnumMapping } from "../controllers/controller";
import { IDoc } from "../models/model";
import { ProductCategory } from "../models/product.model";
import { IRestaurant } from "../models/restaurant.model";
import { getInitialProducts, TestProduct } from "./testData";

let products: TestProduct[] | undefined;

export async function getProducts(
  restaurants: IDoc<IRestaurant>[] = [],
): Promise<TestProduct[]> {
  const Category = ReverseEnumMapping(ProductCategory);
  const categories = await Category();
  products ??= await getInitialProducts(categories, restaurants);

  return products;
}
