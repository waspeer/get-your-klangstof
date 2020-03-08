import { DomainError } from '#root/lib/result';

export enum ErrorTypes {
  EmptyCode = 'EMPTY_CODE',
  ExceededLimit = 'EXCEEDED_LIMIT',
  InvalidUsed = 'INVALIDUSED',
}

export const emptyCode = DomainError.create(ErrorTypes.EmptyCode, 'Download code cannot be empty');

export const exceededLimit = DomainError.create(
  ErrorTypes.ExceededLimit,
  (useLimit: number) => `Download code cannot be use more than ${useLimit} time(s)`,
);

export const invalidUsed = DomainError.create(
  ErrorTypes.InvalidUsed,
  '`used` property cannot be lower than zero',
);
