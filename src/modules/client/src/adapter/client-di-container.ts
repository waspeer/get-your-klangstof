import path from 'path';
import { asClass, asFunction, asValue, createContainer } from 'awilix';
import type { AwilixContainer } from 'awilix';
import { BundlerMiddleware } from './bundler-middleware';
import type { BundlerMiddlewareConfig } from './bundler-middleware';
import type { KoaMiddleware } from '~root/infrastructure/koa/types/koa-middleware';
import type { AwilixDIContainer } from '~root/infrastructure/types/awilix-di-container';

export class ClientDIContainer implements AwilixDIContainer {
  public readonly container: AwilixContainer;

  public constructor() {
    this.container = createContainer();

    this.container.register({
      /**
       * CONFIG
       */

      bundlerMiddlewareConfig: asValue<BundlerMiddlewareConfig>({
        entryFilePath: path.resolve(__dirname, '../index.html'),
        outDir: path.resolve(__dirname, '../../dist'),
      }),

      /**
       * INFRASTRUCTURE
       */

      // KOA
      koaAdapter: asClass<KoaMiddleware>(BundlerMiddleware),
      middleware: asFunction(({ koaAdapter }) => [koaAdapter]),
    });
  }

  public get<T>(name: string): T {
    return this.container.resolve(name);
  }
}
