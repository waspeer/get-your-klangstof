import { Code } from '../entities/code';

export interface CodeRepository {
  findByAssetId(assetId: string): Promise<Code[]>;
  findById(id: string): Promise<Code | undefined>;
  store(code: Code | Code[]): Promise<void>;
}
