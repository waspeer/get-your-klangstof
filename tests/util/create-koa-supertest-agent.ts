/* eslint-disable import/no-extraneous-dependencies */
import http from 'http';
import { agent } from 'supertest';
import type { KoaServer } from '~root/infrastructure/koa/koa-server';

export function createKoaSupertestAgent(server: KoaServer) {
  return agent(http.createServer(server.app.callback()));
}
