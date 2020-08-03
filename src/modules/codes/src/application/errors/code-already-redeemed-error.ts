import { Error } from '~root/lib/errors/error';

export class CodeAlreadyRedeemedError extends Error {
  public constructor(useLimit: number) {
    super(`Code cannot be used more than ${useLimit} time(s)`, CodeAlreadyRedeemedError);
  }
}
