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
  Tags,
} from "tsoa";

import { IMessage } from "../models/model";
import { mock } from "../helpers";

/**
 * Esquema para crear un pedido.
 * @example {
 *   "deliveryTime": "2030-10-20T04:03:42.164Z",
 *   "products": [
 *     { "product": "6530777d23e50c837de795d4", "quantity": 3 }
 *   ],
 *   "restaurant": "65307280beb5043d524138d3",
 *   "user": "6531618e6025da22956875a6"
 * }
 */
export interface OrderCreation {
  deliveryTime: Date;
  products: { product: string; quantity: number }[];
  restaurant: string;
  user: string;
}

/**
 * Esquema para editar un pedido.
 * @example {
 *   "_id": "6531a1b0e9c33a3af568e47e",
 *   "deliveryTime": "2030-10-20T04:03:42.164Z",
 *   "orderRating": 4.8,
 *   "products": [
 *     { "product": "6530777d23e50c837de795d4", "quantity": 3 }
 *   ],
 *   "user": "6531618e6025da22956875a6",
 *   "state": "65305444746510934b074dff"
 * }
 */
export interface OrderUpdate {
  _id: string;
  deliveryTime?: Date;
  orderRating?: number;
  products?: { product: string; quantity: number }[];
  user?: string;
  state?: string;
}

/**
 * Esquema con el cual el backend retorna un pedido.
 * @example {
 *   "_id": "6531a1b0e9c33a3af568e47e",
 *   "createdAt": "2023-10-18T04:03:42.164Z",
 *   "updatedAt": "2023-10-20T04:03:42.164Z",
 *   "deliveryTime": "2030-10-20T04:03:42.164Z",
 *   "orderRating": 4.8,
 *   "products": [
 *     { "product": "6530777d23e50c837de795d4", "quantity": 3 }
 *   ],
 *   "restaurant": "65307280beb5043d524138d3",
 *   "user": "6531618e6025da22956875a6",
 *   "state": {
 *     "_id": "65305444746510934b074dff",
 *     "name": "Entregado"
 *   }
 *   "disabled": false,
 *   "_v": 0
 * }
 */
export interface Order {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  deliveryTime: Date;
  orderRating?: number;
  products: { product: string; quantity: number }[];
  disabled: boolean;
  restaurant: string;
  user: string;
  state: string;
  _v: number;
}

/**
 * Esquema con el cual el backend retorna el estado de un pedido.
 * @example {
 *   "_id": "65305444746510934b074dff",
 *   "name": "Entregado"
 * }
 */
export interface OrderState {
  _id: string;
  name: string;
}

/**
 * CRUD de pedidos.
 */
@Route("orders")
@Tags("Orders")
export abstract class OrderController extends Controller {
  /**
   * Obtiene todos los pedidos que cumplan con los filtros.
   * @param user Búsqueda por id del usuario que creó los pedidos
   * @param restaurant Búsqueda por id de restaurante al cual se le hicieron los pedidos
   * @param startDate Se retornarán los pedidos creados despues de esta fecha
   * @param endDate Se retornarán los pedidos creados antes de esta fecha
   * @summary Get Orders
   */
  @Get("")
  public async getOrders(
    @Query() user?: string,
    @Query() restaurant?: string,
    @Query() startDate?: Date,
    @Query() endDate?: Date,
  ): Promise<Order[]> {
    return mock();
  }

  /**
   * Obtiene todos los pedidos sin aceptar por el restaurante que cumplan con los filtros.
   * @param user Búsqueda por id del usuario que creó los pedidos
   * @param restaurant Búsqueda por id de restaurante al cual se le hicieron los pedidos
   * @param startDate Se retornarán los pedidos creados despues de esta fecha
   * @param endDate Se retornarán los pedidos creados antes de esta fecha
   * @summary Get Unconfirmed Orders
   */
  @Get("unconfirmed")
  public async getUnconfirmed(
    @Query() user?: string,
    @Query() restaurant?: string,
    @Query() startDate?: Date,
    @Query() endDate?: Date,
  ): Promise<Order[]> {
    return mock();
  }

  /**
   * Obtiene todas los estados que los pedidos pueden tener.
   * @summary Get States
   */
  @Get("states")
  public async getStates(): Promise<OrderState[]> {
    return mock();
  }

  /**
   * Obtiene los datos de un pedido.
   * @param id Id del pedido
   * @summary Get Order
   */
  @Get("{id}")
  public async getOrder(@Path() id: string): Promise<Order> {
    return mock();
  }

  /**
   * Crea un nuevo pedido en la base de datos.
   * @param order Datos del nuevo pedido a crear
   * @summary Create Order
   */
  @Post("")
  public async createOrder(@Body() order: OrderCreation): Promise<Order> {
    return mock();
  }

  /**
   * Edita los datos de un pedido. El pedido es identificado por la propiedad _id.
   * @param order El pedido a editar. Todos los campos que estén definidos en este objeto se sobreescriben.
   * @summary Update Order
   */
  @Patch("")
  public async updateOrder(@Body() order: OrderUpdate): Promise<Order> {
    return mock();
  }

  /**
   * Deshabilita un pedido, este ya no se podrá leer.
   * @param id Id del pedido.
   * @summary Delete Order
   */
  @Delete("{id}")
  public async deleteOrder(@Path() id: string): Promise<IMessage> {
    return mock();
  }
}
