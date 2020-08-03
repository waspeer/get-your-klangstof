import { Middleware } from 'koa';

export interface KoaMiddleware {
  get(): Middleware<any, any>;
  namespace?: string;
}
