import type { Asset } from '../../domain/entities/asset';
import type { AssetRepository } from '../../domain/repositories/asset-repository';
import type { CodeRepository } from '../../domain/repositories/code-repository';
import { UniqueConstraintError } from '../errors/unique-constraint-error';
import { AssetMapper } from '../mapper/asset-mapper';
import { SheetRepository } from './sheet-repository';
import type { SheetConfig } from './sheet-repository';
import type { SheetAsset } from './types/sheet-asset';
import type { Logger } from '~root/lib/logger';

interface Dependencies {
  assetSheetConfig: SheetConfig;
  codeRepository: CodeRepository;
  logger: Logger;
}

export class SheetAssetRepository extends SheetRepository implements AssetRepository {
  private readonly codeRepository: CodeRepository;
  private readonly logger: Logger;

  public constructor({ assetSheetConfig, codeRepository, logger }: Dependencies) {
    super({ config: assetSheetConfig });

    this.codeRepository = codeRepository;
    this.logger = logger;
  }

  public async findById(id: string) {
    const sheet = await this.getSheet();
    const rows = await sheet.getRows<SheetAsset>();
    const asset = rows.find((sheetAsset) => sheetAsset.id === id);

    return asset ? AssetMapper.toDomain(asset) : undefined;
  }

  public async findByName(name: string) {
    const sheet = await this.getSheet();
    const rows = await sheet.getRows<SheetAsset>();
    const asset = rows.find((sheetAsset) => sheetAsset.name === name);

    return asset ? AssetMapper.toDomain(asset) : undefined;
  }

  public async store(asset: Asset) {
    const sheet = await this.getSheet();
    const sheetAsset = AssetMapper.toPersistence(asset);
    const existingRows = await sheet.getRows<SheetAsset>();
    const existingAsset = existingRows.find(
      ({ id, name }) => id === asset.id.value || name === asset.name,
    );

    if (!existingAsset) {
      // CREATE
      await sheet.addRow(sheetAsset);

      this.logger.debug('SheetAssetRepository: asset %s successfully created', asset.name);
    } else {
      if (!(existingAsset.id === asset.id.value && existingAsset.name === asset.name)) {
        throw new UniqueConstraintError(
          `Unable to store asset: asset with the id (${asset.id.value}) or name (${asset.name}) already exists`,
        );
      }

      // UPDATE
      Object.entries(sheetAsset).forEach(([key, value]) => {
        existingAsset[key as keyof SheetAsset] = value;
      });

      await existingAsset.save();

      this.logger.debug(
        'SheetAssetRepository: Asset with name %s successfully updated',
        asset.name,
      );
    }

    await this.codeRepository.store(asset.codes);
  }
}
