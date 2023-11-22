import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Path,
  Post,
  Query,
  Route,
  Security,
  Tags,
} from "tsoa";

import { IMessage } from "../models/model";
import { mock } from "../helpers";

/**
 * Esquema para crear un producto.
 * @example {
 *   "name": "Giga Mac",
 *   "description": "45000 kCal y viaje garantizado al hospital",
 *   "image": "https://th.bing.com/th/id/OIP.JpDTcXVjo5p_CGPXJjcOwgHaE8?pid=ImgDet&rs=1",
 *   "category": "65305444746510934b074df9",
 *   "restaurant": "65307280beb5043d524138d3",
 *   "cost": 30
 * }
 */
export interface ProductCreation {
  name: string;
  description: string;
  image: string;
  category: string;
  restaurant: string;
  cost: number;
}

/**
 * Esquema para editar un producto.
 * @example {
 *   "_id": "6530777d23e50c837de795d4",
 *   "name": "Giga Mac",
 *   "description": "45000 kCal y viaje garantizado al hospital",
 *   "image": "https://th.bing.com/th/id/OIP.JpDTcXVjo5p_CGPXJjcOwgHaE8?pid=ImgDet&rs=1",
 *   "category": "65305444746510934b074df9",
 *   "restaurant": "65307280beb5043d524138d3",
 *   "cost": 30
 * }
 */
export interface ProductUpdate {
  _id: string;
  name?: string;
  description?: string;
  image?: string;
  category?: string;
  restaurant?: string;
  cost?: number;
}

/**
 * Esquema con el cual el backend retorna un producto.
 * @example {
 *   "_id": "6530777d23e50c837de795d4",
 *   "name": "Giga Mac",
 *   "description": "45000 kCal y viaje garantizado al hospital",
 *   "image": "https://th.bing.com/th/id/OIP.JpDTcXVjo5p_CGPXJjcOwgHaE8?pid=ImgDet&rs=1",
 *   "category": {
 *     "_id": "65305444746510934b074df9",
 *     "name": "Hamburguesas"
 *   },
 *   "restaurant": "65307280beb5043d524138d3",
 *   "cost": 30,
 *   "disabled": false,
 *   "_v": 0
 * }
 */
export interface Product {
  _id: string;
  name: string;
  description: string;
  image: string;
  category: { _id: string; name: string };
  restaurant: string;
  cost: number;
  disabled: boolean;
  _v: number;
}

/**
 * Esquema con el cual el backend retorna un rol.
 * @example {
 *   "_id": "65305444746510934b074df9",
 *   "name": "Hamburguesas"
 * },
 */
export interface ProductCategory {
  _id: string;
  name: string;
}

/**
 * CRUD de productos.
 */
@Route("products")
@Tags("Products")
export abstract class ProductController extends Controller {
  /**
   * Obtiene todos los productos que cumplan con los filtros.
   * @param restaurant Búsqueda por id de restaurante
   * @param category Búsqueda por id o nombre de categoría
   * @summary Get Products
   */
  @Get("")
  public async getProducts(
    @Query() restaurant?: string,
    @Query() category?: string,
  ): Promise<Product[]> {
    return mock();
  }

  /**
   * Obtiene todas las categorías de productos.
   * @summary Get Categories
   */
  @Get("categories")
  public async getCategories(): Promise<ProductCategory[]> {
    return mock();
  }

  /**
   * Obtiene los datos de un producto.
   * @param id Id del producto
   * @summary Get Product
   */
  @Get("{id}")
  public async getProduct(@Path() id: string): Promise<Product> {
    return mock();
  }

  /**
   * Crea un nuevo producto en la base de datos.
   * @param product Datos del nuevo producto a crear
   * @summary Create Product
   */
  @Post("")
  @Security("token", ["create"])
  public async createProduct(
    @Body() product: ProductCreation,
  ): Promise<Product> {
    return mock();
  }

  /**
   * Edita los datos de un producto. El producto es identificado por la propiedad _id.
   * @param product El producto a editar. Todos los campos que estén definidos en este objeto se sobreescriben.
   * @summary Update Product
   */
  @Patch("")
  @Security("token", ["update"])
  public async updateProduct(@Body() product: ProductUpdate): Promise<Product> {
    return mock();
  }

  /**
   * Deshabilita un producto, este ya no se podrá leer.
   * @param id Id del producto.
   * @summary Delete Product
   */
  @Delete("{id}")
  @Security("token", ["delete"])
  public async deleteProduct(@Path() id: string): Promise<IMessage> {
    return mock();
  }
}
