import type { Asset } from '../entities/asset';

export interface AssetRepository {
  findById(id: string): Promise<Asset | undefined>;
  store(asset: Asset): Promise<void>;
}
