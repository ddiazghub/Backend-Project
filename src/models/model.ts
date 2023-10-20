import mongoose, { Schema, SchemaDefinitionProperty } from "mongoose";

/**
 * Respuesta simple con mensaje.
 * @example {
 *   "status": 404,
 *   "message": "NOT FOUND"
 * }
 */
export interface IMessage {
  status: number,
  message: string,
}

export interface IEnum {
  name: string
}

const EnumSchema = {
  name: {
    type: String,
    required: true,
    minLength: 2,
    unique: true,
  },
};

export interface IResource extends IEnum {
  disabled: boolean
}

export type EnumMap = { [k: string]: string };

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

export interface DisplayEnum {
  _id: string,
  name: string,
}

export type IDoc<T> = T & { _id: mongoose.Types.ObjectId };
export type IDocument<T> = mongoose.Document<unknown, object, T> & IDoc<T>;
export type IModel<T> = mongoose.Model<T, object, object, object, IDocument<T>>;

export type IEnumModel = IModel<IEnum> & { values: string[] };

export function EnumModel(name: string, values: string[]) {
  const model = mongoose.model(name, new Schema(EnumSchema));
  const enumModel = model as unknown as IEnumModel;

  enumModel.values = values;

  return enumModel;
}

export default function Model<T>(name: string, definition: { [K in keyof T]: SchemaDefinitionProperty<T[K]> }, schemaOptions: object = {}) {
  return mongoose.model(name, new Schema(definition, schemaOptions)) as unknown as IModel<T>;
}
