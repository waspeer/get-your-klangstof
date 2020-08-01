import { Asset } from '../../domain/entities/asset';
import type { SheetAsset } from '../google-sheets/types/sheet-asset';
import { UUID } from '~root/lib/domain/uuid';

export class AssetMapper {
  static toDomain(sheetAsset: SheetAsset): Asset {
    return new Asset(
      {
        name: sheetAsset.name,
        url: sheetAsset.url,
      },
      new UUID(sheetAsset.id),
    );
  }

  static toPersistence(asset: Asset): SheetAsset {
    return {
      id: asset.id.value,
      name: asset.name,
      url: asset.url,
    };
  }
}
