import type { CodeRepository } from '../../../domain/repositories/code-repository';
import { DownloadToken } from '../../../domain/value-objects/download-token';
import { CodeAlreadyRedeemedError } from '../../errors/code-already-redeemed-error';
import type { GetAssetByCodeFeature } from '../queries/get-asset-by-code-feature';
import type { Feature } from '~root/lib/application/feature';
import type { Logger } from '~root/lib/logger';

interface Dependencies {
  getAssetByCodeFeature: GetAssetByCodeFeature;
  codeRepository: CodeRepository;
  logger: Logger;
}

interface Arguments {
  codeId: string;
}

export class RedeemCodeForDownloadTokenFeature implements Feature<Arguments, DownloadToken> {
  private readonly codeRepository: CodeRepository;
  private readonly getAssetByCodeFeature: GetAssetByCodeFeature;
  private readonly logger: Logger;

  public constructor({ codeRepository, getAssetByCodeFeature, logger }: Dependencies) {
    this.codeRepository = codeRepository;
    this.getAssetByCodeFeature = getAssetByCodeFeature;
    this.logger = logger;
  }

  public async execute({ codeId }: Arguments) {
    // This will throw an error if the code or asset are not found
    const asset = await this.getAssetByCodeFeature.execute({ codeId });
    const code = asset.codes.find(({ id }) => id.value === codeId)!;

    if (!code.canBeRedeemed) {
      this.logger.debug('RedeemCodeFeature: Code cannot be redeemed');

      throw new CodeAlreadyRedeemedError(code.useLimit);
    }

    const downloadToken = code.redeemForDownloadToken();

    await this.codeRepository.store(code);

    this.logger.debug('RedeemCodeFeature: code with id %s successfully redeemed', code.id);

    return downloadToken;
  }
}
