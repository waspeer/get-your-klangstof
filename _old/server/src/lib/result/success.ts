/* eslint-disable class-methods-use-this */
import { DomainErrorObject } from './types';

/**
 * Represents a successful result
 */
export class Success<T extends DomainErrorObject<any> = DomainErrorObject<any>, S = any> {
  readonly value: S;

  /**
   * Creates a successful result.
   *
   * @param {any} value - The value of the result
   */
  constructor(value?: S) {
    this.value = value as S;
  }

  /**
   * Type guard for Failure class
   */
  isFailure() {
    return false;
  }

  /**
   * Type guard for Success class
   */
  isSuccess(): this is Success<T, S> {
    return true;
  }
}
