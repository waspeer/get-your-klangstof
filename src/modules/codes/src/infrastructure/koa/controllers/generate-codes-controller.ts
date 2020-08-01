import type { Context } from 'koa';
import { AssetNotFoundError } from '../../../application/errors/asset-not-found-error';
import type { GenerateCodesFeature } from '../../../application/features/generate-codes-feature';
import { KoaController, DelegateError } from '~root/infrastructure/koa/koa-controller';
import { UnexpectedError } from '~root/lib/errors/unexpected-error';
import type { Logger } from '~root/lib/logger';

interface Dependencies {
  generateCodesFeature: GenerateCodesFeature;
  logger: Logger;
}

export class GenerateCodesController extends KoaController {
  public readonly generateCodesFeature: GenerateCodesFeature;
  public readonly logger: Logger;

  public constructor({ generateCodesFeature, logger }: Dependencies) {
    super();
    this.generateCodesFeature = generateCodesFeature;
    this.logger = logger;
  }

  @DelegateError
  public async execute(ctx: Context) {
    const { assetId } = ctx.params as { assetId: string };

    await this.generateCodesFeature.execute({ assetId });
  }

  public handleError(error: Error, ctx: Context) {
    switch (error.constructor) {
      case AssetNotFoundError:
        return KoaController.notFound(ctx, error.message);
      default:
        this.logger.error(
          'GenerateCodesController: the error could not be resolved, type of error was: %s',
          error.constructor.name,
        );

        throw new UnexpectedError(error);
    }
  }
}
