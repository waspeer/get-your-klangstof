import { Result, EitherResponse } from '#root/lib/result';

import * as Errors from './errors';

interface Props {
  code: string;
  used: number;
}

type CreateResult = EitherResponse<Errors.ErrorTypes, Code>;

export const USE_LIMIT = 1;

class Code {
  private constructor(private props: Props) {
    //
  }

  get code() {
    return this.props.code;
  }

  get isValid() {
    return this.props.used < USE_LIMIT;
  }

  get used() {
    return this.props.used;
  }

  static create({ code, used }: Props): CreateResult {
    if (used < 0) return Result.fail(Errors.invalidUsed());
    if (!code.length) return Result.fail(Errors.emptyCode());

    return Result.ok(new Code({ code, used }));
  }

  public useCode(): EitherResponse<Errors.ErrorTypes.ExceededLimit, void> {
    if (this.props.used >= USE_LIMIT) {
      return Result.fail(Errors.exceededLimit(USE_LIMIT));
    }

    this.props.used += 1;
    return Result.ok();
  }
}

export default Code;
