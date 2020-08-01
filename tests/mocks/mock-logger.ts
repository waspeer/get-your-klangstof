/* eslint-disable no-console */
import type { Logger } from '~root/lib/logger';

export function createMockLogger({ console: log }: { console?: boolean } = {}): Logger {
  return {
    debug: log ? console.log : jest.fn(),
    error: log ? console.log : jest.fn(),
    info: log ? console.log : jest.fn(),
    warn: log ? console.log : jest.fn(),
  };
}
