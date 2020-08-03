import { Asset } from '../../domain/entities/asset';
import type { Code } from '../../domain/entities/code';
import type { SheetAsset } from '../google-sheets/types/sheet-asset';

export class AssetMapper {
  static toDomain(sheetAsset: SheetAsset, codes?: Code[]): Asset {
    return new Asset({
      codes,
      name: sheetAsset.name,
      url: sheetAsset.url,
    });
  }

  static toPersistence(asset: Asset): SheetAsset {
    return {
      name: asset.name,
      url: asset.url,
    };
  }
}
