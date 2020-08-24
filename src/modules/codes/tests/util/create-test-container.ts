import { asValue } from 'awilix';
import { CodesDIContainer } from '../../src/infrastructure/codes-di-container';
import { createMockAssetRepository } from '../mocks/mock-asset-repository';
import { createMockCodeRepository } from '../mocks/mock-code-repository';
import { createMockDomainEventEmitter } from '../mocks/mock-domain-event-emitter';
import { createMockLogger } from '~root/../tests/mocks/mock-logger';

interface Options {
  log?: boolean;
}

export function createTestContainer({ log = false }: Options = {}) {
  const container = new CodesDIContainer();
  const mockAssetRepository = createMockAssetRepository();
  const mockCodeRepository = createMockCodeRepository();
  const mockDomainEventEmitter = createMockDomainEventEmitter();
  const mockLogger = createMockLogger({ console: log });

  container.container.register({
    assetRepository: asValue(mockAssetRepository),
    codeRepository: asValue(mockCodeRepository),
    domainEventEmitter: asValue(mockDomainEventEmitter),
    logger: asValue(mockLogger),
  });

  return {
    container,
    mockAssetRepository,
    mockCodeRepository,
    mockDomainEventEmitter,
    mockLogger,
  };
}
