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
} from "tsoa";

import { IMessage } from "../models/model";
import { mock } from "../helpers";

/**
 * Esquema para crear un producto.
 * @example {
 *   "name": "Giga Mac",
 *   "description": "45000 kCal para el viaje garantizado al hospital",
 *   "image": "https://th.bing.com/th/id/OIP.JpDTcXVjo5p_CGPXJjcOwgHaE8?pid=ImgDet&rs=1",
 *   "category": "65305444746510934b074df9",
 *   "restaurant": "65307280beb5043d524138d3",
 * }
 */
export interface ProductCreation {
  name: string;
  description: string,
  image: string,
  category: string,
  restaurant: string,
}

/**
 * Esquema con el cual el backend retorna un producto.
 * @example {
 *   "_id": "6530777d23e50c837de795d4",
 *   "name": "Giga Mac",
 *   "description": "45000 kCal de viaje garantizado al hospital",
 *   "image": "https://th.bing.com/th/id/OIP.JpDTcXVjo5p_CGPXJjcOwgHaE8?pid=ImgDet&rs=1",
 *   "category": {
 *     "_id": "65305444746510934b074df9",
 *     "name": "Hamburguesas"
 *   },
 *   "restaurant": "65307280beb5043d524138d3",
 *   "disabled": false,
 *   "_v": 0
 * }
 */
export interface Product {
  _id: string;
  name: string;
  description: string,
  image: string,
  category: { _id: string; name: string };
  restaurant: string,
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
  _id: string,
  name: string,
}

/**
 * CRUD de usuarios.
 */
@Route("products")
export abstract class ProductController extends Controller {
  /**
   * Obtiene todos los usuarios.
   * @summary Get Products
   */
  @Get("")
  public async getProducts(): Promise<Product[]> {
    return mock();
  }

  /**
   * Obtiene todos los roles de usuario.
   * @summary Get Roles
   */
  @Get("categories")
  public async getCategories(): Promise<ProductCategory[]> {
    return mock();
  }

  /**
   * Obtiene los datos de un usuario.
   * @param id Id del usuario
   * @summary Get Product
   */
  @Get("{id}")
  public async getProduct(@Path() id: string): Promise<Product> {
    return mock();
  }

  /**
   * Registra un nuevo usuario en la base de datos.
   * @param product El usuario a registrar
   * @summary Create Product
   */
  @Post("")
  public async register(@Body() product: ProductCreation): Promise<Product> {
    return mock();
  }

  /**
   * Edita los datos de un usuario. El usuario es identificado por la propiedad _id.
   * @param product El usuario a editar. Todos los campos que estén definidos en este objeto se sobreescriben.
   * @summary Update Product
   */
  @Patch("")
  public async updateProduct(@Body() product: Product): Promise<Product> {
    return mock();
  }

  /**
   * Deshabilita un usuario, este ya no se podrá leer.
   * @param id Id del usuario.
   * @summary Delete Product
   */
  @Delete("{id}")
  public async deleteProduct(@Path() id: string): Promise<IMessage> {
    return mock();
  }
}
