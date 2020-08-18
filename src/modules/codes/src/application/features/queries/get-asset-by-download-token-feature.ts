import type { Asset } from '../../../domain/entities/asset';
import type { AssetRepository } from '../../../domain/repositories/asset-repository';
import { DownloadToken } from '../../../domain/value-objects/download-token';
import { AssociatedAssetNotFoundError } from '../../errors/associated-asset-not-found-error';
import type { Feature } from '~root/lib/application/feature';

interface Arguments {
  downloadToken: string;
}

interface Dependencies {
  assetRepository: AssetRepository;
}

export class GetAssetByDownloadTokenFeature implements Feature<Arguments, Asset> {
  private readonly assetRepository: AssetRepository;

  public constructor({ assetRepository }: Dependencies) {
    this.assetRepository = assetRepository;
  }

  public async execute(args: Arguments) {
    const downloadToken = new DownloadToken(args.downloadToken);
    const { assetName } = downloadToken.verify();

    const asset = await this.assetRepository.findByName(assetName);

    if (!asset) {
      throw new AssociatedAssetNotFoundError({ token: downloadToken.value });
    }

    return asset;
  }
}
