import Model, { EnumSchema, IEnum, IResource, ResourceSchema }  from "./model";
import mongoose, { ObjectId } from "mongoose";

export enum EOrderState {
  Created = "Creado",
  InProgress = "En Curso",
  OnTheWay = "En Camino",
  Delivered = "Entregado"
}

// Estados de un pedido
export const IOrderState = Model<IEnum>("OrderState", EnumSchema);

export interface IOrderProduct {
  product: ObjectId,
  order: ObjectId,
  quantity: number,
}

export const OrderProduct = Model<IOrderProduct>("OrderProduct", {
  // El producto que se está pidiendo
  product: {
    type: mongoose.Types.ObjectId, // Referencia a Product
    ref: "Product",
    required: true,
  },

  // El pedido
  order: {
    type: mongoose.Types.ObjectId, // Referencia a OrderSchema
    ref: "Order",
    required: true,
  },

  // Cantidad del producto que se pidió
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
});

export interface IOrder extends IResource {
  deliveryTime: Date,
  orderRating?: number,
  restaurantId: ObjectId,
  userId: ObjectId,
}

// Pedidos
export const Order = Model<IOrder>("Order", {
  ...ResourceSchema,

  // Tiempo esperado de entrega
  deliveryTime: {
    type: Date,
    required: true,
    min: new Date()
  },

  // Calificación del usuario a la orden. Es nula hasta que el pedido llegue a la etapa de entregado
  orderRating: {
    type: Number,
    min: 0,
  },

  // El restaurante al cual se realizó la orden
  restaurantId: {
    type: mongoose.Types.ObjectId, // Referencia a RestaurantSchema
    ref: "Restaurant",
    required: true,
  },

  // El usuario que realizó el pedido
  userId: {
    type: mongoose.Types.ObjectId, // Referencia a UserSchema
    ref: "User",
    required: true,
  },
});
