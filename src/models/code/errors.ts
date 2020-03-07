import Error from '#root/lib/error';

import { USE_LIMIT } from './code';

export enum ErrorTypes {
  EmptyCode = 'EMPTY_CODE',
  ExceededLimit = 'EXCEEDED_LIMIT',
  InvalidUsed = 'INVALIDUSED',
}

const Errors = {
  types: ErrorTypes,
  emptyCode: () => Error.create(ErrorTypes.EmptyCode, 'Download code cannot be empty'),
  exceededLimit: () =>
    Error.create(
      ErrorTypes.ExceededLimit,
      `Download code cannot be use more than ${USE_LIMIT} time(s)`,
    ),
  invalidUsed: () =>
    Error.create(ErrorTypes.InvalidUsed, '`used` property cannot be lower than zero'),
};

export default Errors;
