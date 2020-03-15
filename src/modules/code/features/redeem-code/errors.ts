import { ErrorTypes as CodeErrorTypes } from '../../models/code/errors';
import { DomainError } from '#root/lib/result';

export const ErrorTypes = {
  ExceededLimit: CodeErrorTypes.ExceededLimit as const,
  NotFound: 'NOT_FOUND' as const,
};

export const notFound = DomainError.create(ErrorTypes.NotFound, 'The code does not exist.');

export { exceededLimit } from '../../models/code/errors';
