/* eslint-disable class-methods-use-this */
import { DomainErrorObject } from './types';

/**
 * Represents a failed result.
 */
export class Failure<T extends DomainErrorObject<any>, S = any> {
  readonly error: T;

  get value(): S {
    // The structure of the Failure class should be the same as that
    // of the Success class so Typescript doesn't complain when trying
    // to retrieve the value of a result you know is successful.

    throw new Error('unable to retrieve value from failed result');
  }

  /**
   * Creates a failed result
   *
   * @param {DomainErrorObject} error - The error that occurred
   */
  constructor(error: T) {
    this.error = error;
  }

  /**
   * Type guard for the Failure class
   */
  isFailure(): this is Failure<T, S> {
    return true;
  }

  /**
   * Type guard for the Success class
   */
  isSuccess() {
    return false;
  }
}
