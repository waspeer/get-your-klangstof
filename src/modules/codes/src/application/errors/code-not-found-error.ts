import { Error } from '~root/lib/errors/error';

export class CodeNotFoundError extends Error {
  public constructor(codeValue: string) {
    super(`Unable to find code with value '${codeValue}'`, CodeNotFoundError);
  }
}
