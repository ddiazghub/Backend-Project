export class HttpError extends Error {
  status: number;
  
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, HttpError.prototype);
  }

  override toString() {
    return this.message;
  }
}

export default {
  notFound: new HttpError(404, "Not Found"),
  unauthorized: new HttpError(401, "Unauthorized"),
  forbidden: new HttpError(401, "Forbidden. The user is not allowed to access the resource"),
  loginFailed: new HttpError(401, "Login failed. Incorrect username or password"),
};
