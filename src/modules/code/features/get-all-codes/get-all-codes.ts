import { DomainError, Result, ErrorOr } from '#root/lib/result';

import CodeRepo from '../../adapters/code-repo';
import Code from '../../models/code';

const createFeature = (codeRepo: CodeRepo) =>
  async function getAllCodes(): Promise<ErrorOr<Code[]>> {
    try {
      const codes = await codeRepo.getAll();
      return Result.ok(codes);
    } catch (error) {
      return Result.fail(DomainError.unexpected(error));
    }
  };

export default createFeature;
