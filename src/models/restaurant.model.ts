import Model, { EnumModel, IDoc, IResource, ResourceSchema } from "./model";
import mongoose, { ObjectId } from "mongoose";

enum ERestaurantCategory {
  Italian = "Italiano",
  FastFood = "Comida Rápida",
}

export const RestaurantCategory = EnumModel(
  "RestaurantCategory",
  ERestaurantCategory,
);

export interface IRestaurant extends IResource {
  administrator: ObjectId;
  category: ObjectId;
  deliveryTime: number;
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
  },
);
