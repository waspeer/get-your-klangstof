import { asClass, asValue, createContainer, asFunction } from 'awilix';
import type { AwilixContainer } from 'awilix';
import { getEnvironmentVariable } from '../lib/helpers/get-environment-variable';
import type { DIContainer } from '../lib/infrastructure/di-container';
import type { Logger } from '../lib/logger';
import { KoaServer, ServerConfig } from './koa/koa-server';
import type { AwilixDIContainer } from './types/awilix-di-container';
import type { Server } from './types/server';
import { WinstonLogger } from './winston-logger';

export class AppDiContainer implements DIContainer {
  private readonly container: AwilixContainer;

  public constructor(modules: AwilixDIContainer[]) {
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

      middleware: asFunction(() => modules.flatMap((module) => module.get('middleware'))),
      server: asClass<Server>(KoaServer),
    });

    // REGISTER COMMON DEPENDENCIES
    modules.forEach(({ container }) => {
      container.register({
        logger: asValue(this.get('logger')),
      });
    });
  }

  public get<T>(name: string): T {
    return this.container.resolve(name);
  }
}