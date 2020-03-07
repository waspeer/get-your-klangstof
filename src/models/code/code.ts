import { ok, err, Result } from 'resulty';

import { ErrorObject } from '#root/lib/error';

import Errors, { ErrorTypes } from './errors';

interface Props {
  code: string;
  used: number;
}

export const USE_LIMIT = 1;

class Code {
  private constructor(private props: Props) {
    //
  }

  get code() {
    return this.props.code;
  }

  get used() {
    return this.props.used;
  }

  set used(timesUsed: number) {
    this.props.used = timesUsed;
  }

  static create({ code, used }: Props): Result<ErrorObject<ErrorTypes>, string> {
    if (used < 0) return err(Errors.invalidUsed());
    if (used > USE_LIMIT) return err(Errors.exceededLimit());
    if (!code.length) return err(Errors.emptyCode());

    return ok(code);
  }
}

export default Code;
