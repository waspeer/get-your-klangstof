import type { AssetRepository } from '../../../domain/repositories/asset-repository';
import { AssetNotFoundError } from '../../errors/asset-not-found-error';
import type { Feature } from '~root/lib/application/feature';
import type { Logger } from '~root/lib/logger';

interface Dependencies {
  assetRepository: AssetRepository;
  logger: Logger;
}

interface Arguments {
  assetName: string;
}

export class GenerateCodesFeature implements Feature<Arguments, void> {
  private readonly assetRepository: AssetRepository;
  private readonly logger: Logger;

  public constructor({ assetRepository, logger }: Dependencies) {
    this.assetRepository = assetRepository;
    this.logger = logger;
  }

  public async execute({ assetName }: Arguments) {
    const asset = await this.assetRepository.findByName(assetName);

    if (!asset) {
      this.logger.debug('GenerateCodesFeature: Asset with name %s was not found', assetName);

      throw new AssetNotFoundError(assetName);
    }

    this.logger.debug('GenerateCodesFeature: Asset with name %s was found', assetName);

    asset.generateCodes();

    await this.assetRepository.store(asset);
  }
}
