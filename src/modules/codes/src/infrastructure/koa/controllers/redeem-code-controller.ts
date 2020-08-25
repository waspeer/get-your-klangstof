import type { Context } from 'koa';
import * as yup from 'yup';
import { AssociatedAssetNotFoundError } from '../../../application/errors/associated-asset-not-found-error';
import { CodeAlreadyRedeemedError } from '../../../application/errors/code-already-redeemed-error';
import { CodeNotFoundError } from '../../../application/errors/code-not-found-error';
import type { RedeemCodeForDownloadTokenFeature } from '../../../application/features/commands/redeem-code-for-download-token-feature';
import { DelegateError, KoaController } from '~root/infrastructure/koa/koa-controller';
import { UnexpectedError } from '~root/lib/errors/unexpected-error';
import { getEnvironmentVariable } from '~root/lib/helpers/get-environment-variable';
import type { Logger } from '~root/lib/logger';
import { ValidationError } from '~root/lib/validate/validation-error';

interface Dependencies {
  logger: Logger;
  redeemCodeForDownloadTokenFeature: RedeemCodeForDownloadTokenFeature;
}

const API_URL = getEnvironmentVariable('API_URL');

const requestBodySchema = yup
  .object({
    redeemer: yup
      .object({
        email: yup.string().required(),
      })
      .notRequired()
      .default(undefined),
  })
  .required();

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
    const body = await requestBodySchema.validate(ctx.request.body);

    this.logger.debug('RedeemCodeController: Received request to redeem code %s', codeId);

    const downloadToken = await this.redeemCodeForDownloadTokenFeature.execute({
      codeId,
      redeemerEmail: body.redeemer?.email,
    });

    ctx.body = {
      downloadLink: new URL(`download/${downloadToken.value}`, API_URL),
    };
  }

  public handleError(error: Error, ctx: Context) {
    switch (error.constructor) {
      case yup.ValidationError:
      case ValidationError:
        this.logger.debug('RedeemCodeController: validation error, %s', error.message);

        return KoaController.badRequest(ctx, error);
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
