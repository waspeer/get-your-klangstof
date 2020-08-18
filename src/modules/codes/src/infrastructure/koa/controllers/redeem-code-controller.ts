import type { Context } from 'koa';
import { AssociatedAssetNotFoundError } from '../../../application/errors/associated-asset-not-found-error';
import { CodeAlreadyRedeemedError } from '../../../application/errors/code-already-redeemed-error';
import { CodeNotFoundError } from '../../../application/errors/code-not-found-error';
import type { RedeemCodeForDownloadTokenFeature } from '../../../application/features/commands/redeem-code-for-download-token-feature';
import { DelegateError, KoaController } from '~root/infrastructure/koa/koa-controller';
import { UnexpectedError } from '~root/lib/errors/unexpected-error';
import { getEnvironmentVariable } from '~root/lib/helpers/get-environment-variable';
import type { Logger } from '~root/lib/logger';

interface Dependencies {
  logger: Logger;
  redeemCodeForDownloadTokenFeature: RedeemCodeForDownloadTokenFeature;
}

const API_URL = getEnvironmentVariable('API_URL');

export class RedeemCodeController extends KoaController {
  private readonly logger: Logger;
  private readonly redeemCodeForDownloadTokenFeature: RedeemCodeForDownloadTokenFeature;

  public constructor({ logger, redeemCodeForDownloadTokenFeature }: Dependencies) {
    super();
    this.logger = logger;
    this.redeemCodeForDownloadTokenFeature = redeemCodeForDownloadTokenFeature;
  }

  @DelegateError
  public async execute(ctx: Context) {
    const { codeId } = ctx.params as { codeId: string };

    this.logger.debug('RedeemCodeController: Received request to redeem code %s', codeId);

    const downloadToken = await this.redeemCodeForDownloadTokenFeature.execute({ codeId });

    ctx.body = {
      downloadLink: new URL(`download/${downloadToken.value}`, API_URL),
    };
  }

  public handleError(error: Error, ctx: Context) {
    switch (error.constructor) {
      case CodeNotFoundError:
      case AssociatedAssetNotFoundError:
        return KoaController.notFound(ctx, error);
      case CodeAlreadyRedeemedError:
        return KoaController.forbidden(ctx, error);
      default:
        this.logger.error(
          'GenerateCodesController: the error could not be resolved, type of error was: %s',
          error.constructor.name,
        );

        throw new UnexpectedError(error);
    }
  }
}
