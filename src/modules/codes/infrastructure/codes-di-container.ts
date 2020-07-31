import { createContainer, asClass, asFunction } from 'awilix';
import type { AwilixContainer } from 'awilix';
import { KoaRouter } from './koa/koa-router';
import type { KoaMiddleware } from '~root/infrastructure/koa/types/koa-middleware';
import { DIContainer } from '~root/lib/infrastructure/di-container';

export class CodesDIContainer implements DIContainer {
  private readonly container: AwilixContainer;

  public constructor() {
    this.container = createContainer();

    this.container.register({
      /**
       * INFRASTRUCTURE
       */

      // KOA
      koaRouter: asClass<KoaMiddleware>(KoaRouter),

      /**
       * EXPORTS
       */

      middleware: asFunction(({ koaRouter }) => [koaRouter]),
    });
  }

  public get<T>(name: string): T {
    return this.container.resolve(name);
  }
}
