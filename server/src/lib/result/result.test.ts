import * as DomainError from './domain-error';
// import { DomainErrorObject } from './domain-error';
import { Failure } from './failure';
import * as Result from './result';
import { Success } from './success';

const errorType = 'TEST_ERROR' as const;
// type TestError = DomainErrorObject<typeof errorType>;
const testError = DomainError.create(errorType, 'everything is wrong')();

describe('Result', () => {
  describe('.fail', () => {
    it('should create a Failure instance', () => {
      const result = Result.fail(testError);

      expect(result).toBeInstanceOf(Failure);
      expect(result.isFailure() && result.error).toBe(testError);
    });
  });

  describe('.ok', () => {
    it('should create a Success instance without a value', () => {
      const result = Result.ok();

      expect(result).toBeInstanceOf(Success);
    });

    it('should create a Success instance with a value', () => {
      const value = 'time is an illusion';
      const result = Result.ok(value);

      expect(result).toBeInstanceOf(Success);
      expect(result.isSuccess() && result.value).toBe(value);
    });
  });

  describe('.combine', () => {
    it('should return the first error in a result array', () => {
      const results = [true, true, false, true].map((status) =>
        status ? Result.ok() : Result.fail(testError),
      );

      const result = Result.combine(results);

      expect(result).toBeInstanceOf(Failure);
      expect(result.isFailure() && result.error).toBe(testError);
    });

    it('should return a succes result when all results are succeful', () => {
      const results = [true, true, true, true].map((status) =>
        status ? Result.ok() : Result.fail(testError),
      );

      const result = Result.combine(results);

      expect(result).toBeInstanceOf(Success);
    });
  });

  describe('.isResult', () => {
    it('should return true when provided with a result', () => {
      const success = Result.ok();
      const failure = Result.fail(testError);

      expect(Result.isResult(success)).toBe(true);
      expect(Result.isResult(failure)).toBe(true);
    });

    it('should return false when not provided with a result', () => {
      const random = 'RaAaaAndom!!';

      expect(Result.isResult(random)).toBe(false);
    });
  });
});
