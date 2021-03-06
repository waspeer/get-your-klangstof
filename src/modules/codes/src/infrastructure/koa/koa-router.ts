import Router from '@koa/router';
import auth from 'koa-basic-auth';
import { KoaController } from '~root/infrastructure/koa/koa-controller';
import type { KoaMiddleware } from '~root/infrastructure/koa/types/koa-middleware';
import { getEnvironmentVariable } from '~root/lib/helpers/get-environment-variable';

interface Dependencies {
  downloadAssetController: KoaController;
  generateCodesController: KoaController;
  redeemCodeController: KoaController;
}

const ADMIN_USERNAME = getEnvironmentVariable('ADMIN_USERNAME');
const ADMIN_PASSWORD = getEnvironmentVariable('ADMIN_PASSWORD');

export class KoaRouter implements KoaMiddleware {
  private readonly router: Router;

  public constructor({
    downloadAssetController,
    generateCodesController,
    redeemCodeController,
  }: Dependencies) {
    this.router = new Router<{ resource: { id: string } }>()
      // ASSET ROUTES
      .post(
        '/assets/:assetName/generate-codes',

        auth({
          name: ADMIN_USERNAME,
          pass: ADMIN_PASSWORD,
        }),

        (ctx) => generateCodesController.execute(ctx as any),
      )

      .get(
        '/download/:downloadToken',

        (ctx) => downloadAssetController.execute(ctx as any),
      )

      // CODE ROUTES
      .post(
        '/codes/:codeId/redeem',

        (ctx) => redeemCodeController.execute(ctx as any),
      );
  }

  public get() {
    return this.router.routes();
  }
}
