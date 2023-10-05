import mongoose, { ObjectId } from "mongoose";
import Model, { EnumSchema, IEnum, ResourceSchema, IResource } from "./model";

// Categorías de productos de menu de los restaurantes
export enum EProductCategory {
  Idk = "idk",
}

export const ProductCategory = Model<IEnum>("ProductCategory", EnumSchema);

export interface IProduct extends IResource {
  description: string,
  image: string,
  category: ObjectId,
  restaurant: ObjectId,
}

export const Product = Model<IProduct>(
  "Product",
  {
    ...ResourceSchema,

    description: {
      type: String,
      required: true,
      minLength: 2,
    },

    image: {
      type: String, // url
      default: "", // url de foto predeterminada
      validate: (value: string) => {
        try {
          new URL(value);

          return true;
        } catch {
          return false;
        }
      },
    },

    // Categoría del producto
    category: {
      type: mongoose.Types.ObjectId, // Referencia a ProductCategory
      ref: "ProductCategory",
      required: true,
    },

    // Restaurante al cual pertenece el producto
    restaurant: {
      type: mongoose.Types.ObjectId, // Referencia a RestaurantSchema
      ref: "Restaurant",
      required: true,
    },
  },
);
