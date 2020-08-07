import type { Server as HttpServer } from 'http';
import Koa from 'koa';
import mount from 'koa-mount';
import type { Logger } from '../../lib/logger';
import type { Server } from '../types/server';
import type { KoaMiddleware } from './types/koa-middleware';

export interface ServerConfig {
  host?: string;
  port: number;
}

interface Dependencies {
  logger: Logger;
  middleware: KoaMiddleware[];
  serverConfig: ServerConfig;
}

export class KoaServer implements Server {
  private readonly config: ServerConfig;
  private readonly logger: Logger;
  private server?: HttpServer;
  public readonly app: Koa;

  public constructor({ logger, middleware, serverConfig }: Dependencies) {
    const app = new Koa();

    // TODO add helmet
    // TODO add compress
    // TODO add body?

    middleware.forEach((mw) => app.use(mount(mw.namespace ?? '/', mw.get())));

    this.app = app;
    this.config = serverConfig;
    this.logger = logger;
  }

  public async start() {
    const { host, port } = this.config;

    this.server = this.app.listen(port, host, () => {
      this.logger.info('Server listening on http://%s:%s', host, port);
    });
  }

  public async close() {
    const { host, port } = this.config;

    if (this.server) {
      this.server.close(() => {
        this.logger.info('Server closed on http://%s:%s', host, port);
      });
    }
  }
}
