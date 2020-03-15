import { Failure } from './failure';
import { Success } from './success';

/**
 * Type of errors occurring in the domain.
 *
 * @template T - The string type of the error.
 */
export interface DomainErrorObject<T extends string> {
  type: T;
  message: string;
  error?: any;
}

/**
 * Repesents a type that is either a successful result or an error.
 *
 * @template T - The type of the unsuccesful result.
 * @template S - The type of the successful result.
 */
export type Either<T extends DomainErrorObject<any>, S> = Failure<T, S> | Success<T, S>;

/**
 * Represents a return value that is either a DomainError or a succesful
 * result of type T.
 *
 * @template T - The type of the result when it's successful.
 */
export type ErrorOr<T> = Either<DomainErrorObject<any>, T>;

/**
 * Represents a return value that is either a DomainError or
 * a successful result.
 *
 * @template T - The possible errorTypes.
 * @template S - The type of the result.
 */
export type EitherResponse<T extends string, S> = Either<
  DomainErrorObject<T> | DomainErrorObject<any>,
  S
>;
