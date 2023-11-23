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

export class NotFound extends HttpError {
  constructor() {
    super(404, "Not Found");
  }
}

export class Unauthorized extends HttpError {
  constructor() {
    super(401, "Unauthorized");
  }
}

export class Forbidden extends HttpError {
  constructor() {
    super(
      403,
      "Forbidden. The user is not authorized to access the resource",
    );
  }
}

export class LoginFailed extends HttpError {
  constructor() {
    super(
      401,
      "Login failed. Incorrect username or password",
    );
  }
}
