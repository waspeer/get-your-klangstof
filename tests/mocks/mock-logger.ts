import type { Logger } from '~root/lib/logger';

export function createMockLogger(): Logger {
  return {
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  };
}
