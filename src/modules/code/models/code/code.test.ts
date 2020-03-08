import Code, { USE_LIMIT } from './code';
import * as Errors from './errors';

describe('Code', () => {
  describe('.create', () => {
    it('should fail when `used` prop is less than zero', () => {
      const resultLower = Code.create({
        code: 'blah',
        used: -1,
      });
      expect(resultLower.isFailure()).toBe(true);
      expect(resultLower.isFailure() && resultLower.error).toEqual(Errors.invalidUsed());

      const resultZero = Code.create({
        code: 'blah',
        used: 0,
      });
      expect(resultZero.isSuccess()).toBe(true);
    });

    it.skip('should fail when `used` prop exceeds the maximum', () => {
      const result = Code.create({
        code: 'blah',
        used: USE_LIMIT + 2,
      });
      expect(result.isFailure()).toBe(true);
      expect(result.isFailure() && result.error).toEqual(Errors.exceededLimit(USE_LIMIT));
    });

    it('should fail when the code is empty', () => {
      const result = Code.create({
        code: '',
        used: 0,
      });
      expect(result.isFailure()).toBe(true);
      expect(result.isFailure() && result.error).toEqual(Errors.emptyCode());
    });
  });

  describe('.isValid', () => {
    it('should return false when code has been used too many times', () => {
      const result = Code.create({
        code: 'blah',
        used: USE_LIMIT + 2,
      });
      const code = result.value;
      expect(code.isValid).toBe(false);
    });

    it('should return true when code has not been used', () => {
      const result = Code.create({
        code: 'blah',
        used: 0,
      });
      const code = result.value;
      expect(code.isValid).toBe(true);
    });
  });
});
