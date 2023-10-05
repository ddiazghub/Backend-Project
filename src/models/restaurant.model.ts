import Model, { EnumSchema, IEnum, IResource, ResourceSchema } from "./model";
import mongoose, { ObjectId } from "mongoose";

export enum ERestaurantCategory {
  Italian = "Italiano"
}

export const RestaurantCategory = Model<IEnum>("RestaurantCategory", EnumSchema);

export interface IRestaurant extends IResource {
  administrator: ObjectId;
  category: ObjectId;
  deliveryTime: number;
  rating: number;
}

// Restaurantes
export const Restaurant = Model<IRestaurant>(
  "Restaurant",
  {
    ...ResourceSchema,

    // Usuario administrador del restaurante
    administrator: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },

    category: {
      type: mongoose.Types.ObjectId,
      ref: "RestaurantCategory",
      required: true,
    },

    // Tiempo de entrega esperado del restaurante
    deliveryTime: {
      type: Number,
      required: true,
      min: 0,
    },

    // Calificación promedio de todas las ventas del restaurante
    rating: {
      type: Number,
      required: true,
      min: 0,
    },
  },
);
