import type { Asset } from '../entities/asset';

export interface AssetRepository {
  findByName(name: string): Promise<Asset | undefined>;
  store(asset: Asset): Promise<void>;
}
