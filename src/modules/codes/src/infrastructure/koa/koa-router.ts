import Router from '@koa/router';
import type Koa from 'koa';
import auth from 'koa-basic-auth';
import { KoaController } from '~root/infrastructure/koa/koa-controller';
import type { KoaMiddleware } from '~root/infrastructure/koa/types/koa-middleware';
import { getEnvironmentVariable } from '~root/lib/helpers/get-environment-variable';

interface Dependencies {
  generateCodesController: KoaController;
}

const ADMIN_USERNAME = getEnvironmentVariable('ADMIN_USERNAME');
const ADMIN_PASSWORD = getEnvironmentVariable('ADMIN_PASSWORD');

export class KoaRouter implements KoaMiddleware {
  private readonly router: Router;

  public constructor({ generateCodesController }: Dependencies) {
    this.router = new Router<{ resource: { id: string } }>()
      // ASSET ROUTES
      .post(
        '/assets/:assetName/generate-codes',

        auth({
          name: ADMIN_USERNAME,
          pass: ADMIN_PASSWORD,
        }),

        (ctx) => generateCodesController.execute(ctx),
      );
  }

  public register(app: Koa) {
    app.use(this.router.routes());
  }
}
