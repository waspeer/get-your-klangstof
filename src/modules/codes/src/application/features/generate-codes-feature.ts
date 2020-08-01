import type { AssetRepository } from '../../domain/repositories/asset-repository';
import { AssetNotFoundError } from '../errors/asset-not-found-error';
import type { Feature } from '~root/lib/application/feature';

interface Dependencies {
  assetRepository: AssetRepository;
}

interface Arguments {
  assetId: string;
}

export class GenerateCodesFeature implements Feature<Arguments, void> {
  private readonly assetRepository: AssetRepository;

  public constructor({ assetRepository }: Dependencies) {
    this.assetRepository = assetRepository;
  }

  public async execute({ assetId }: Arguments) {
    const asset = await this.assetRepository.findById(assetId);

    if (!asset) {
      throw new AssetNotFoundError(assetId);
    }

    asset.generateCodes();

    await this.assetRepository.store(asset);
  }
}
