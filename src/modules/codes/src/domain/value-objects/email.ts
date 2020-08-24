import { Validate } from '~root/lib/validate';

export class Email {
  public constructor(public readonly value: string) {
    Validate.string(value).email();
  }
}
