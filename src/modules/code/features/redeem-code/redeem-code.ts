import { Result, DomainError } from '#root/lib/result';

import CodeRepo from '../../adapters/code-repo';
import RedeemCodeDTO from './dto';

const createFeature = (codeRepo: CodeRepo) => {
  return async function redeemCode(dto: RedeemCodeDTO) {
    try {
      const code = await codeRepo.getCode(dto.code);
      const result = code.useCode();

      if (result.isFailure()) return result;

      await codeRepo.updateCode(code);
      return Result.ok();
    } catch (error) {
      return Result.fail(DomainError.unexpected(error));
    }
  };
};

export default createFeature;
