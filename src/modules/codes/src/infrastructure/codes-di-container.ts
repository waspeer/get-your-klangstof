import { createContainer, asClass, asFunction } from 'awilix';
import type { AwilixContainer } from 'awilix';
import { GenerateCodesFeature } from '../application/features/generate-codes-feature';
import { GenerateCodesController } from './koa/controllers/generate-codes-controller';
import { KoaRouter } from './koa/koa-router';
import type { KoaController } from '~root/infrastructure/koa/koa-controller';
import type { KoaMiddleware } from '~root/infrastructure/koa/types/koa-middleware';
import type { AwilixDIContainer } from '~root/infrastructure/types/awilix-di-container';

const notImplemented = (name: string) => () => {
  throw new Error(
    `CodesDIContainer: '${name}' is not implemented. Did you forget to implement it in AppDIContainer?`,
  );
};

export class CodesDIContainer implements AwilixDIContainer {
  public readonly container: AwilixContainer;

  public constructor() {
    this.container = createContainer();

    this.container.register({
      /**
       * GENERAL
       */

      logger: asFunction(notImplemented('logger')),

      /**
       * INFRASTRUCTURE
       */

      // KOA
      router: asClass<KoaMiddleware>(KoaRouter),
      generateCodesController: asClass<KoaController>(GenerateCodesController),

      /**
       * APPLICATION
       */

      // FEATURES
      generateCodesFeature: asClass(GenerateCodesFeature),

      /**
       * EXPORTS
       */

      middleware: asFunction(({ router }) => [router]),
    });
  }

  public get<T>(name: string): T {
    return this.container.resolve(name);
  }
}
