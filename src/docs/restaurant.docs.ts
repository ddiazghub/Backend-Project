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
 * Esquema para crear un restaurante.
 * @example {
 *   "name": "McDonalds",
 *   "administrator": "6531618e6025da22956875a6",
 *   "category": "65305444746510934b074df9",
 *   "deliveryTime": 30
 * }
 */
export interface RestaurantCreation {
  name: string;
  administrator: string;
  category: string;
  deliveryTime: number;
}

/**
 * Esquema con el cual el backend retorna un restaurante.
 * @example {
 *   "_id": "65307280beb5043d524138d3",
 *   "name": "McDonalds",
 *   "disabled": false,
 *   "administrator": "6531618e6025da22956875a6",
 *   "category":{
 *     "_id": "65305444746510934b074df9",
 *     "name": "Comida Rápida"
 *   },
 *   "deliveryTime": 15,
 *   "__v": 0
 * }
 */
export interface DisplayRestaurant {
  _id: string;
  name: string;
  administrator: string;
  deliveryTime: number;
  category: { _id: string; name: string };
  disabled: boolean;
  _v: number;
}

/**
 * Esquema con el cual el backend retorna una categoris.
 * @example {
 *   "_id": "65305444746510934b074df9",
 *   "name": "Comida Rápida"
 * }
 */
export interface DisplayCategory {
  _id: string;
  name: string;
}

/**
 * CRUD de usuarios.
 */
@Route("restaurants")
export abstract class UserController extends Controller {
  /**
   * Obtiene todos los restaurantes.
   * @param name Búsqueda por nombre de restaurantes
   * @param category Búsqueda por id o nombre de categoría
   * @summary Get Restaurants
   */
  @Get("")
  public async getRestaurants(@Query() name: string, @Query() category: string): Promise<DisplayRestaurant[]> {
    return mock();
  }

  /**
   * Obtiene totas las categorias de restaurante.
   * @summary Get Categories
   */
  @Get("categories")
  public async getCategories(): Promise<DisplayCategory[]> {
    return mock();
  }

  /**
   * Obtiene los datos de un restaurante.
   * @param id Id del restaurante
   * @summary Get Restaurant
   */
  @Get("{id}")
  public async getRestaurant(@Path() id: string): Promise<DisplayRestaurant> {
    return mock();
  }

  /**
   * Crea un nuevo restaurante en la base de datos.
   * @param user El restaurante a crear
   * @summary Create Restaurant
   */
  @Post("")
  public async createRestaurant(@Body() restaurant: RestaurantCreation): Promise<DisplayRestaurant> {
    return mock();
  }

  /**
   * Edita los datos de un restaurant. El restaurant es identificado por la propiedad _id.
   * @param user El usuario a editar. Todos los campos que estén definidos en este objeto se sobreescriben.
   * @summary Update Restaurant
   */
  @Patch("")
  public async updateRestaurant(@Body() restaurant: DisplayRestaurant): Promise<DisplayRestaurant> {
    return mock();
  }

  /**
   * Deshabilita un restaurante, este ya no se podrá leer.
   * @param id Id del restaurante.
   * @summary Delete Restaurant
   */
  @Delete("{id}")
  public async deleteRestaurant(@Path() id: string): Promise<IMessage> {
    return mock();
  }
}
