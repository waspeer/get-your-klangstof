import generateCode from 'adjective-adjective-animal';
import Code from '../../models/code';
import CodeRepo from '../../adapters/code-repo';
import { Result, DomainError } from '#root/lib/result';

const NEW_AMOUNT = 10;
const ADJ_AMOUNT = 2;

const createFeature = (codeRepo: CodeRepo) => {
  return async function addCodes() {
    try {
      const codeStrings = await Promise.all(
        [...Array(NEW_AMOUNT)].map(() => generateCode(ADJ_AMOUNT)),
      );

      const codes = Array.from(codeStrings).map((codeString) => {
        const result = Code.create({ code: codeString, used: 0 });
        if (result.isFailure()) throw result.error;
        return result.value;
      });

      await codeRepo.addCodes(codes);
      return Result.ok();
    } catch (error) {
      return Result.fail(DomainError.unexpected(error));
    }
  };
};

export default createFeature;
