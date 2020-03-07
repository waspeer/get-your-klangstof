import { Result } from 'resulty';

import Code, { USE_LIMIT } from './code';
import Errors from './errors';

const getResultValue = <E, A>(result: Result<E, A>) =>
  result.cata<E | A>({ Ok: (v) => v, Err: (err) => err });

const isOk = <E, A>(result: Result<E, A>) => result.cata({ Ok: () => true, Err: () => false });

describe('Code', () => {
  describe('.create', () => {
    it('should fail when `used` prop is less than zero', () => {
      const resultLower = Code.create({
        code: 'blah',
        used: -1,
      });
      expect(getResultValue(resultLower)).toEqual(Errors.invalidUsed());

      const resultZero = Code.create({
        code: 'blah',
        used: 0,
      });
      expect(isOk(resultZero)).toBe(true);
    });

    it('should fail when `used` prop exceeds the maximum', () => {
      const result = Code.create({
        code: 'blah',
        used: USE_LIMIT + 2,
      });
      expect(getResultValue(result)).toEqual(Errors.exceededLimit());
    });

    it('should fail when the code is empty', () => {
      const result = Code.create({
        code: '',
        used: 0,
      });
      expect(getResultValue(result)).toEqual(Errors.emptyCode());
    });
  });
});
