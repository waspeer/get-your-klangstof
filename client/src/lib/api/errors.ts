import { Error } from './types';

const createError = <T extends string>(error: T, message: string): Error<T> => ({
  succes: false,
  error,
  message,
});

export const ErrorTypes = {
  NotFound: 'NOT_FOUND' as const,
  Unexpected: 'UNEXPECTED_ERROR' as const,
};

export const notFound = createError(ErrorTypes.NotFound, 'Download code does not exist.');

export const unexpected = createError(
  ErrorTypes.Unexpected,
  'Something unexpected happened, try again later!',
);
