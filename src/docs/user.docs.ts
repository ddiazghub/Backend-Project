import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Path,
  Post,
  Query,
  Route,
  Tags,
} from "tsoa";

import { IMessage } from "../models/model";
import { mock } from "../helpers";

/**
 * Esquema para crear un usuario.
 * @example {
 *   "name": "pepito",
 *   "lastName": "perez",
 *   "email": "elpepe@email.com",
 *   "password": "0123456789ABCDEF",
 *   "phone": 10000000001,
 *   "birthday": "2000-10-20T04:03:42.164Z",
 *   "role": "65305445746510934b074e05"
 * }
 */
export interface UserCreation {
  name: string;
  lastName: string;
  email: string;
  password: string;
  phone: number;
  birthday: Date;
  role: string;
}

/**
 * Esquema con el cual el backend retorna un usuario.
 * @example {
 *   "_id": "6531618e6025da22956875a6",
 *   "name": "user",
 *   "lastName": "admin",
 *   "email": "user@email.com",
 *   "password": "0123456789ABCDEF",
 *   "phone": 10000000000,
 *   "birthday": "1995-10-20T04:03:42.164Z",
 *   "role": {
 *     "_id": "65305445746510934b074e05",
 *     "name": "Administrador"
 *   },
 *   "disabled": false,
 *   "_v": 0
 * }
 */
export interface User {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  phone: number;
  birthday: Date;
  disabled: boolean;
  role: { _id: string; name: string };
  _v: number;
}

/**
 * Esquema con el cual el backend retorna un rol.
 * @example {
 *   "_id": "65305445746510934b074e05",
 *   "name": "Administrador"
 * }
 */
export interface Role {
  _id: string,
  name: string,
}

/**
 * CRUD de usuarios.
 */
@Route("users")
@Tags("Users")
export abstract class UserController extends Controller {
  /**
   * Obtiene todos los usuarios.
   * @summary Get Users
   */
  @Get("")
  public async getUsers(): Promise<User[]> {
    return mock();
  }

  /**
   * Obtiene todos los roles de usuario.
   * @summary Get Roles
   */
  @Get("roles")
  public async getRoles(): Promise<Role[]> {
    return mock();
  }

  /**
   * Obtiene los datos de un usuario.
   * @param id Id del usuario
   * @summary Get User
   */
  @Get("{id}")
  public async getUser(@Path() id: string): Promise<User> {
    return mock();
  }

  /**
   * Inicia sesión con los credenciales suministrados.
   * @param email Email del usuario
   * @param password Contraseña del usuario
   * @summary Login
   */
  @Get("login")
  public async login(
    @Query() email: string,
    @Query() password: string,
  ): Promise<User> {
    return mock();
  }

  /**
   * Registra un nuevo usuario en la base de datos.
   * @param user El usuario a registrar
   * @summary Create User
   */
  @Post("")
  public async register(@Body() user: UserCreation): Promise<User> {
    return mock();
  }

  /**
   * Edita los datos de un usuario. El usuario es identificado por la propiedad _id.
   * @param user El usuario a editar. Todos los campos que estén definidos en este objeto se sobreescriben.
   * @summary Update User
   */
  @Patch("")
  public async updateUser(@Body() user: User): Promise<User> {
    return mock();
  }

  /**
   * Deshabilita un usuario, este ya no se podrá leer.
   * @param id Id del usuario.
   * @summary Delete User
   */
  @Delete("{id}")
  public async deleteUser(@Path() id: string): Promise<IMessage> {
    return mock();
  }
}
