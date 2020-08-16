import { Error } from '~root/lib/errors/error';

export class TokenExpiredError extends Error {
  public constructor() {
    super('Unable to verify token: token has expired', TokenExpiredError);
  }
}
