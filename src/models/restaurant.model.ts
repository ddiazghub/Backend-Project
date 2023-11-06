import Model, { EnumModel, IDoc, IResource, ResourceSchema } from "./model";
import mongoose, { ObjectId } from "mongoose";

export const RestaurantCategoryValues = [
  "Postres",
  "Asiatico",
  "Mexicano",
  "Arabe",
  "Saludable",
  "Vegetariano",
  "Panaderia",
  "Parrilla",
  "Desayuno",
  "Bar",
  "Italiano",
  "Comida Rapida",
];

export const RestaurantCategory = EnumModel("RestaurantCategory", RestaurantCategoryValues);

export interface IRestaurant extends IResource {
  administrator: ObjectId;
  category: ObjectId;
  deliveryTime: number;
}

export interface IDisplayRestaurant extends IRestaurant {
  sales: number;
  rating: number | null;
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
