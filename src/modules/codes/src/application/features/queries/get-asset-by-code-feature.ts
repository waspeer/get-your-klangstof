import type { Asset } from '../../../domain/entities/asset';
import type { AssetRepository } from '../../../domain/repositories/asset-repository';
import type { CodeRepository } from '../../../domain/repositories/code-repository';
import { AssociatedAssetNotFoundError } from '../../errors/associated-asset-not-found-error';
import { CodeNotFoundError } from '../../errors/code-not-found-error';
import type { Feature } from '~root/lib/application/feature';
import type { Logger } from '~root/lib/logger';

interface Dependencies {
  assetRepository: AssetRepository;
  codeRepository: CodeRepository;
  logger: Logger;
}

interface Arguments {
  codeId: string;
}

export class GetAssetByCodeFeature implements Feature<Arguments, Asset> {
  private readonly assetRepository: AssetRepository;
  private readonly codeRepository: CodeRepository;
  private readonly logger: Logger;

  public constructor({ assetRepository, codeRepository, logger }: Dependencies) {
    this.assetRepository = assetRepository;
    this.codeRepository = codeRepository;
    this.logger = logger;
  }

  public async execute({ codeId }: Arguments) {
    const code = await this.codeRepository.findById(codeId);

    if (!code) {
      this.logger.debug('GetAssetByCodeFeature: code with value %s was not found', codeId);

      throw new CodeNotFoundError(codeId);
    }

    const asset = await this.assetRepository.findByName(code.assetName);

    if (!asset) {
      this.logger.debug('GetAssetByCodeFeature: asset with name %s was not found', code.assetName);

      throw new AssociatedAssetNotFoundError({ code: codeId });
    }

    this.logger.debug(
      'GetAssetByCodeFeature: found code %s and associated asset %s',
      codeId,
      code.assetName,
    );

    return asset;
  }
}
