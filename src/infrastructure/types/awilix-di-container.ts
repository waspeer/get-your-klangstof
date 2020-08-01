import type { AwilixContainer } from 'awilix';
import type { DIContainer } from '~root/lib/infrastructure/di-container';

export interface AwilixDIContainer extends DIContainer {
  container: AwilixContainer;
}
