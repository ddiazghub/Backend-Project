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
  Security,
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
 * Esquema para editar un usuario.
 * @example {
 *   "_id": "6531618e6025da22956875a6",
 *   "name": "pepito",
 *   "lastName": "perez",
 *   "email": "elpepe@email.com",
 *   "password": "0123456789ABCDEF",
 *   "phone": 10000000001,
 *   "role": "65305445746510934b074e05"
 * }
 */
export interface UserUpdate {
  _id: string;
  name?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phone?: number;
  role?: string;
}

/**
 * Esquema con el cual el backend retorna un usuario.
 * @example {
 *   "_id": "6531618e6025da22956875a6",
 *   "name": "user",
 *   "lastName": "admin",
 *   "email": "user@email.com",
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
  phone: number;
  birthday: Date;
  disabled: boolean;
  role: { _id: string; name: string };
  _v: number;
}

/**
 * Esquema con el cual el backend retorna un usuario.
 * @example {
 *   "user": {
 *     "_id": "6531618e6025da22956875a6",
 *     "name": "user",
 *     "lastName": "admin",
 *     "email": "user@email.com",
 *     "phone": 10000000000,
 *     "birthday": "1995-10-20T04:03:42.164Z",
 *     "role": {
 *     "_id": "65305445746510934b074e05",
 *     "name": "Administrador"
 *   },
 *   "disabled": false,
 *   "_v": 0
 *   },
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTVhZGUxOGNhMDkxMjUxOGZkNWFmNGYiLCJleHAiOjE3MDA2NzI1MjUxMzcsImlhdCI6MTcwMDY2ODkyNX0.KkfqNqnUV_KjbU6kyP_7i1E65oNa7qjysXEUfBDYdJw"
 * }
 */
export interface UserToken {
  user: User;
  token: string;
}

/**
 * Esquema con el cual el backend retorna un rol.
 * @example {
 *   "_id": "65305445746510934b074e05",
 *   "name": "Administrador"
 * }
 */
export interface Role {
  _id: string;
  name: string;
}

/**
 * Secreto que permite continuar con el 2fa.
 * @example {
 *    "message": "Envíe el token generado por su app 2fa a la ruta /users/auth para terminar el inicio de sesión",
 *   "secret": "DKKEHIJCUSPDRYQO6LEZOFKVZALASSWD",
 *   "uri": "otpauth://totp/Proyecto%20Backend%3Aadmin%40email.com?secret=DKKEHIJCUSPDRYQO6LEZOFKVZALASSWD&issuer=Proyecto%20Backend",
*   "qr": "https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=otpauth://totp/Proyecto%20Backend%3Aadmin%40email.com%3Fsecret=DKKEHIJCUSPDRYQO6LEZOFKVZALASSWD%26issuer=Proyecto%20Backend",
 *   "updatedAt": "2030-10-20T04:03:42.164Z"
 * }
*/
export interface MfaSecret {
  status: number;
  secret: string;
  uri: string;
  qr: string;
  updatedAt: Date;
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
  ): Promise<UserToken | MfaSecret> {
    return mock();
  }

  /**
   * Continua el flujo de inicio de sesión para administradores.
   * Recibe un token de 2fa y lo valida para decidir si se le da acceso al usuario.
   * @param user ID del usuario el cual está iniciando sesión.
   * @param token Token de 2fa suministrado por la app autenticadora.
   * @summary 2FA Auth
   */
  @Post("auth")
  public async auth(
    @Query() user: string,
    @Query() token: string,
  ): Promise<UserToken> {
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
  @Security("token", ["update"])
  public async updateUser(@Body() user: UserUpdate): Promise<User> {
    return mock();
  }

  /**
   * Deshabilita un usuario, este ya no se podrá leer.
   * @param id Id del usuario.
   * @summary Delete User
   */
  @Delete("{id}")
  @Security("token", ["delete"])
  public async deleteUser(@Path() id: string): Promise<IMessage> {
    return mock();
  }
}
