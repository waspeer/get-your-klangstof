import { Error } from '~root/lib/errors/error';

export class UniqueConstraintError extends Error {
  public constructor(message: string) {
    super(message, UniqueConstraintError);
  }
}
