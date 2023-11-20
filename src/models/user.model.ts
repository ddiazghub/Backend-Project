import mongoose, { ObjectId } from "mongoose";
import Model, {
  EnumModel,
  IResource,
  ResourceSchema,
} from "./model";

const UserRoleValues = [
  "Usuario",
  "Administrador",
];

// Roles de usuario. Usuario, Administrador, etc...
export const UserRole = EnumModel("UserRole", UserRoleValues);

export interface IUser extends IResource {
  lastName: string;
  email: string;
  passwordHash: string;
  phone: number;
  birthday: Date;
  role: ObjectId;
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

  passwordHash: {
    type: String,
    required: true,
  },

  birthday: {
    type: Date,
    required: true,
    immutable: true,
  },
});
