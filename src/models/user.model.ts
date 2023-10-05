import mongoose, { ObjectId } from "mongoose";
import Model, { ResourceSchema, EnumSchema, IEnum, IResource } from "./model";

// Roles de usuario. Usuario, Administrador, etc...
export enum EUserRole {
  User = "Usuario",
  Admin = "Administrador",
}

export const UserRole = Model<IEnum>("UserRole", EnumSchema);

export interface IUser extends IResource {
  lastName: string,
  email: string,
  password: string,
  phone: number,
  birthday: Date,
  role: ObjectId,
}

// Usuario.
export const User = Model<IUser>("User", {
  ...ResourceSchema,

  lastName: {
    type: String,
    required: true,
    minLength: 2,
  },

  // Rol del usuario
  role: {
    type: mongoose.Types.ObjectId, // id del rol en el schema de UserRolaSchema
    ref: "UserRole",
    required: true,
  },

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  phone: {
    type: Number,
    required: true,
    unique: true,
    max: 99_999_999_999_999, // hay indicativos de 4 digitos
    min: 10_000_000_000,
    get: (value: number) => { // agrega + al comienzo
      return "+" + value;
    },
  },

  email: {
    type: String,
    required: true,
    match: /^[^.\s][\w-]+(\.[\w-]+)*@([\w-]+\.)+[\w-]{2,}$/gm, // regex email
    unique: true,
  },

  password: {
    type: String,
    required: true,
    minLength: 12,
    validation: () => {
      // validacion de caracteres especiales, minusculas, mayusculas, numeros
      return true;
    },
  },

  birthday: {
    type: Date,
    required: true,
    immutable: true,
  },
});
