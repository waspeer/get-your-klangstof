import got from 'got';
import type { Context } from 'koa';
import { AssociatedAssetNotFoundError } from '../../../application/errors/associated-asset-not-found-error';
import { InvalidTokenError } from '../../../domain/errors/invalid-token-error';
import { TokenExpiredError } from '../../../domain/errors/token-expired-error';
import { DelegateError, KoaController } from '~root/infrastructure/koa/koa-controller';
import { Feature } from '~root/lib/application/feature';
import { UnexpectedError } from '~root/lib/errors/unexpected-error';
import type { Logger } from '~root/lib/logger';

interface Dependencies {
  getAssetByDownloadTokenFeature: Feature<any, any>; // TODO
  logger: Logger;
}

export class DownloadAssetController extends KoaController {
  public readonly getAssetByDownloadTokenFeature: any; // TODO
  public readonly logger: Logger;

  public constructor({ getAssetByDownloadTokenFeature, logger }: Dependencies) {
    super();
    this.getAssetByDownloadTokenFeature = getAssetByDownloadTokenFeature;
    this.logger = logger;
  }

  @DelegateError
  public async execute(ctx: Context) {
    const { downloadToken } = ctx.params as { downloadToken: string };

    this.logger.debug(
      'DownloadAssetController: Received request with downloadToken %s',
      downloadToken,
    );

    const asset = await this.getAssetByDownloadTokenFeature.execute({ downloadToken });
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
      case InvalidTokenError:
      case TokenExpiredError:
        return KoaController.forbidden(ctx, error);
      case AssociatedAssetNotFoundError:
        return KoaController.notFound(ctx, error);
      default:
        this.logger.error(
          'GenerateCodesController: the error could not be resolved, type of error was: %s',
          error.constructor.name,
        );

        throw new UnexpectedError(error);
    }
  }
}
