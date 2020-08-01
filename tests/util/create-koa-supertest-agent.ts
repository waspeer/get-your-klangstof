/* eslint-disable import/no-extraneous-dependencies */
import http from 'http';
import Koa from 'koa';
import { agent } from 'supertest';
import type { KoaServer } from '~root/infrastructure/koa/koa-server';
import type { KoaMiddleware } from '~root/infrastructure/koa/types/koa-middleware';

export function createKoaSupertestAgentFromServer(server: KoaServer) {
  return agent(http.createServer(server.app.callback()));
}

export function createKoaSupertestAgentFromRouter(router: KoaMiddleware) {
  const app = new Koa();

  router.register(app);

  return agent(http.createServer(app.callback()));
}
