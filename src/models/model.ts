import mongoose, { Schema, SchemaDefinitionProperty } from "mongoose";

export interface IEnum {
  name: string
}

export const EnumSchema = {
  name: {
    type: String,
    required: true,
    minLength: 2,
  },
};

export interface IResource extends IEnum {
  disabled: boolean
}

export const ResourceSchema = {
  name: {
    type: String,
    required: true,
    minLength: 2,
  },

  disabled: {
    type: Boolean,
    default: false,
  },
};

export default function Model<T>(name: string, definition: { [K in keyof T]: SchemaDefinitionProperty<T[K]> }) {
  return mongoose.model(name, new Schema(definition));
}
