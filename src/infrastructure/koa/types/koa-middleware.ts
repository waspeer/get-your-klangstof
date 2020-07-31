import Koa from 'koa';

export interface KoaMiddleware {
  register(app: Koa): void;
}
