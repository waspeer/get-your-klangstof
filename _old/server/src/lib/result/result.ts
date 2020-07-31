import { DomainErrorObject, Either } from './types';
import { Failure } from './failure';
import { Success } from './success';

/**
 * Creates a Failure class
 *
 * @param {DomainErrorObject} error - The DomainErroObject
 */
export function fail<T extends DomainErrorObject<any>, S = any>(error: T): Either<T, S> {
  return new Failure<T, S>(error);
}

/**
 * Creates a Success class
 *
 * @param {any} value - The value of the result
 */
export function ok<T, S extends DomainErrorObject<any> = DomainErrorObject<any>>(
  value?: T,
): Either<S, T> {
  return new Success<S, T>(value);
}

/**
 * When given an array of results it will either return the first error
 * it finds or return a Success result
 *
 * @param {Array.<Success|Failure>} results
 */
export function combine<T extends DomainErrorObject<any>>(
  results: Either<T, any>[],
): Either<T, any> {
  return results.reduce((combinedResult, result) => {
    if (combinedResult.isFailure()) {
      return combinedResult;
    }
    return result;
  }, ok());
}

/**
 * Tests if an object is a result
 *
 * @param object - The object to be tested
 */
export function isResult(object: any): boolean {
  return object.constructor === Success || object.constructor === Failure;
}
