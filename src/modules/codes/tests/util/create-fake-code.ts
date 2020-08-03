import { Code } from '../../src/domain/entities/code';
import { UUID } from '~root/lib/domain/uuid';

export function createFakeCode({
  assetName = 'asset-name',
  used = 0,
  useLimit = 1,
  value = 'fake-code',
}: {
  assetName?: any;
  used?: any;
  useLimit?: any;
  value?: any;
} = {}) {
  return new Code({ assetName, used, useLimit }, new UUID(value));
}
