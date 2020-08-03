import got from 'got';
import type { Context } from 'koa';
import { AssetNotFoundError } from '../../../application/errors/asset-not-found-error';
import { CodeAlreadyRedeemedError } from '../../../application/errors/code-already-redeemed-error';
import { CodeNotFoundError } from '../../../application/errors/code-not-found-error';
import type { RedeemCodeFeature } from '../../../application/features/commands/redeem-code-feature';
import type { GetAssetByCodeFeature } from '../../../application/features/queries/get-asset-by-code-feature';
import { DelegateError, KoaController } from '~root/infrastructure/koa/koa-controller';
import { UnexpectedError } from '~root/lib/errors/unexpected-error';
import type { Logger } from '~root/lib/logger';

interface Dependencies {
  logger: Logger;
  getAssetByCodeFeature: GetAssetByCodeFeature;
  redeemCodeFeature: RedeemCodeFeature;
}

export class RedeemCodeController extends KoaController {
  private readonly getAssetByCodeFeature: GetAssetByCodeFeature;
  private readonly logger: Logger;
  private readonly redeemCodeFeature: RedeemCodeFeature;

  public constructor({ getAssetByCodeFeature, logger, redeemCodeFeature }: Dependencies) {
    super();
    this.getAssetByCodeFeature = getAssetByCodeFeature;
    this.logger = logger;
    this.redeemCodeFeature = redeemCodeFeature;
  }

  @DelegateError
  public async execute(ctx: Context) {
    const { codeId } = ctx.params as { codeId: string };

    this.logger.debug('RedeemCodeController: Received request to redeem code %s', codeId);

    await this.redeemCodeFeature.execute({ codeId });

    const asset = await this.getAssetByCodeFeature.execute({ codeId });
    const { headers } = await got.head(asset.url);

    ctx.set({
      'Content-type': headers['content-type'] || 'application/zip',
      'Content-length': headers['content-length'] || '',
      'Content-disposition': `attachment; filename=${asset.name ?? 'download.zip'}`,
    });
    ctx.body = got.stream(asset.url);
  }

  public handleError(error: Error, ctx: Context) {
    switch (error.constructor) {
      case CodeNotFoundError:
      case AssetNotFoundError:
        return KoaController.notFound(ctx, error.message);
      case CodeAlreadyRedeemedError:
        return KoaController.forbidden(ctx, error.message);
      default:
        this.logger.error(
          'GenerateCodesController: the error could not be resolved, type of error was: %s',
          error.constructor.name,
        );

        throw new UnexpectedError(error);
    }
  }
}
