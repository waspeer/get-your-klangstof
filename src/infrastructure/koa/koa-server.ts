import type { Server as HttpServer } from 'http';
import cors from '@koa/cors';
import Koa from 'koa';
import bodyParser from 'koa-body';
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

    app.use(cors());
    app.use(bodyParser());

    // Error middleware
    app.use(async (ctx, next) => {
      try {
        await next();

        if (ctx.status === 404) {
          ctx.throw(404, 'This endpoint does not exists');
        }
      } catch (error) {
        ctx.status = error.statusCode || error.status || 500;
        ctx.body = {
          statusCode: ctx.status,
          error: error.constructor.name,
          message: error.message,
        };
      }
    });

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
