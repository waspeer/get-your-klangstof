import * as DomainError from './domain-error';
import { Failure } from './failure';
import { DomainErrorObject } from './types';

const errorType = 'TEST_ERROR' as const;
type TestError = DomainErrorObject<typeof errorType>;
const testError = DomainError.create(errorType, 'everything is wrong')();

describe('Failure', () => {
  let failure: Failure<TestError>;

  beforeAll(() => {
    failure = new Failure(testError);
  });

  it('should construct', () => {
    expect(failure).toBeInstanceOf(Failure);
    expect(failure.error).toBe(testError);
  });

  it('should communicate identity', () => {
    expect(failure.isFailure()).toBe(true);
    expect(failure.isSuccess()).toBe(false);
  });

  it('should throw error when trying to access the value', () => {
    expect(() => failure.value).toThrow();
  });
});
