import { asClass, asValue, createContainer, asFunction } from 'awilix';
import type { AwilixContainer } from 'awilix';
import { getEnvironmentVariable } from '../lib/helpers/get-environment-variable';
import type { DIContainer } from '../lib/infrastructure/di-container';
import type { Logger } from '../lib/logger';
import { KoaServer, ServerConfig } from './koa/koa-server';
import { KoaMiddleware } from './koa/types/koa-middleware';
import type { AwilixDIContainer } from './types/awilix-di-container';
import type { Server } from './types/server';
import { WinstonLogger } from './winston-logger';

interface ModuleOptions {
  urlNamespace?: string;
}

type NormalizedModule = [AwilixDIContainer, ModuleOptions];

export type Modules = (NormalizedModule | AwilixDIContainer)[];

export class AppDiContainer implements DIContainer {
  private readonly container: AwilixContainer;

  public constructor(nonNormalizedModules: Modules) {
    const modules: NormalizedModule[] = nonNormalizedModules.map((module) =>
      Array.isArray(module) ? module : [module, {} as ModuleOptions],
    );

    this.container = createContainer();

    this.container.register({
      /**
       * CONFIG
       */

      serverConfig: asValue<ServerConfig>({
        host: getEnvironmentVariable('HOST', 'localhost'),
        port: +getEnvironmentVariable('PORT', '3030'),
      }),

      /**
       * GENERAL
       */

      logger: asClass<Logger>(WinstonLogger),

      /**
       * INFRASTRUCTURE
       */

      middleware: asFunction(() =>
        modules.flatMap(([module, { urlNamespace }]) => {
          const middleware = module.get<KoaMiddleware[]>('middleware');

          return middleware.map((mw) => {
            // eslint-disable-next-line no-param-reassign
            mw.namespace = urlNamespace;

            return mw;
          });
        }),
      ),
      server: asClass<Server>(KoaServer),
    });

    // REGISTER COMMON DEPENDENCIES
    modules.forEach(([{ container }]) => {
      container.register({
        logger: asValue(this.get('logger')),
      });
    });
  }

  public get<T>(name: string): T {
    return this.container.resolve(name);
  }
}
