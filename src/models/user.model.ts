import mongoose, { ObjectId, Schema } from "mongoose";
import Model, {
  EnumModel,
  IResource,
  refValidator,
  ResourceSchema,
} from "./model";

export enum MfaStatus {
  Password = 0,
  Otp = 1,
}

const UserRoleValues = [
  "Usuario",
  "Administrador",
];

// Roles de usuario. Usuario, Administrador, etc...
export const UserRole = EnumModel("UserRole", UserRoleValues);

export interface MfaSecret {
  status: MfaStatus;
  secret: string;
  uri: string;
  qr: string;
  updatedAt: Date;
}

export interface IUser extends IResource {
  lastName: string;
  email: string;
  passwordHash: string;
  phone: number;
  birthday: Date;
  role: ObjectId;
  mfaSecret?: MfaSecret;
}

const MfaSchema = new Schema({
  status: {
    type: Number,
    default: MfaStatus.Password,
    validate: (value: number) => value < Object.keys(MfaStatus).length,
  },
  secret: {
    type: String,
    required: true,
  },
  uri: {
    type: String,
    required: true,
  },
  qr: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

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
    validate: refValidator(
      UserRole,
      "The user's role does not exist",
    ),
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

  mfaSecret: MfaSchema,
});
