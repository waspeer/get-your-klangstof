import Router from '@koa/router';
import type Koa from 'koa';
import auth from 'koa-basic-auth';
import type { KoaMiddleware } from '~root/infrastructure/koa/types/koa-middleware';
import { getEnvironmentVariable } from '~root/lib/helpers/get-environment-variable';

const ADMIN_USERNAME = getEnvironmentVariable('ADMIN_USERNAME');
const ADMIN_PASSWORD = getEnvironmentVariable('ADMIN_PASSWORD');

export class KoaRouter implements KoaMiddleware {
  private readonly router: Router;

  public constructor() {
    const router = new Router();

    router.post(
      '/codes/generate',

      auth({
        name: ADMIN_USERNAME,
        pass: ADMIN_PASSWORD,
      }),

      (ctx) => {
        ctx.status = 201;
        ctx.body = 'hoi';
      },
    );

    this.router = router;
  }

  public register(app: Koa) {
    app.use(this.router.routes());
  }
}
