import { Error } from '~root/lib/errors/error';

export class InvalidTokenError extends Error {
  public constructor() {
    super('Unable to verify token: the provided token is invalid', InvalidTokenError);
  }
}
