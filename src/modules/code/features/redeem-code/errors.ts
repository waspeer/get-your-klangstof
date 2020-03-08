import { ErrorTypes as CodeErrorTypes } from '../../models/code/errors';

export enum ErrorTypes {
  'ExceededLimit' = CodeErrorTypes.ExceededLimit,
}

export { exceededLimit } from '../../models/code/errors';
