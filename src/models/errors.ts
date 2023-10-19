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
  loginFailed: new HttpError(401, "Login failed. Incorrect username or password"),
};
