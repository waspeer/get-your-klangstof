import { DomainErrorObject } from './types';

/**
 * Type of messageCreator that can be provided to the create function
 */
interface MessageCreator {
  (...args: any[]): string;
}

/**
 * Creates a new DomainError function to create typed DomainErrorsObjects
 *
 * @param {string} type - The type of the error
 * @param {string|MessageCreator} message - The message or messageCreator
 */
export function create<T extends string, S extends MessageCreator>(type: T, message: S | string) {
  return function typedDomainError(...args: Parameters<S>): DomainErrorObject<T> {
    return {
      type,
      message: typeof message === 'function' ? message(...args) : message,
    };
  };
}

/**
 * The types of an unexpected error wrapped in an enum for consistency
 */
export enum errorTypes {
  UNEXPECTED_ERROR = 'UNEXPECTED_ERROR',
}

/**
 * Creates a DomainErrorObject for an unexpected error
 *
 * @param {any} e - The unexpected error
 */
export function unexpected(e?: any): DomainErrorObject<typeof errorTypes.UNEXPECTED_ERROR> {
  console.error('An unexpected error occurred:', e || 'no error was provided');

  return {
    type: errorTypes.UNEXPECTED_ERROR,
    message: 'an unexpected error occurred',
    error: e,
  };
}
