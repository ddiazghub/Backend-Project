import Model, { EnumSchema, IEnum, IResource, ResourceSchema } from "./model";
import mongoose, { ObjectId } from "mongoose";

// Una de las posibles ubicaciones de un restaurante.
export interface ILocation extends IResource {
  address: string;
  maxServiceRange: number;
  restaurant: ObjectId;
}

// Una de las posibles ubicaciones de un restaurante.
export const Location = Model<ILocation>("Location", {
  ...ResourceSchema,

  // Dirección
  address: {
    type: String,
    required: true,
    minLength: 2,
  },

  // Rango máximo de servicio en Km
  maxServiceRange: {
    type: Number,
    required: true,
    min: 0,
  },

  // Restaurante al cual pertenece
  restaurant: {
    type: mongoose.Types.ObjectId, // Referencia a RestaurantSchema
    ref: "Restaurant",
    required: true,
  },
});

export interface IRestaurant extends IResource {
  administrator: ObjectId;
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
