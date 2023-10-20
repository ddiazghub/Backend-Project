import Model, {
  EnumModel,
  IDoc,
  IResource,
  ResourceSchema,
} from "./model";
import mongoose, { ObjectId, Schema } from "mongoose";

export enum EOrderState {
  Created = "Creado",
  InProgress = "En Curso",
  OnTheWay = "En Camino",
  Delivered = "Entregado",
}

// Estados de un pedido
export const OrderState = EnumModel("OrderState", EOrderState);

export interface IOrderProduct {
  product: ObjectId;
  quantity: number;
}

export interface IOrder {
  createdAt?: Date;
  updatedAt?: Date;
  deliveryTime: Date;
  orderRating?: number;
  products: IOrderProduct[];
  disabled: boolean;
  restaurant: ObjectId;
  user: ObjectId;
  state?: ObjectId;
}

const OrderProductSchema = new Schema<IOrderProduct>({
  // El producto que se está pidiendo
  product: {
    type: mongoose.Types.ObjectId, // Referencia a Product
    ref: "Product",
    required: true,
  },

  // Cantidad del producto que se pidió
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
});

// Pedidos
export const Order = Model<IOrder>("Order", {
  disabled: {
    type: Boolean,
    default: false,
  },

  // Tiempo esperado de entrega
  deliveryTime: {
    type: Date,
    required: true,
    min: new Date(),
  },

  // Calificación del usuario a la orden. Es nula hasta que el pedido llegue a la etapa de entregado
  orderRating: {
    type: Number,
    min: 0,
  },

  // El restaurante al cual se realizó la orden
  restaurant: {
    type: mongoose.Types.ObjectId,
    ref: "Restaurant",
    required: true,
    immutable: true,
  },

  // El usuario que realizó el pedido
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // El estado del pedido
  state: {
    type: mongoose.Types.ObjectId,
    ref: "OrderState",
  },

  products: {
    type: [OrderProductSchema],
    required: true,
    minLength: 1,
  },
}, { timestamps: true });
