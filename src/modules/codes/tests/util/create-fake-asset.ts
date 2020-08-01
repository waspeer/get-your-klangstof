import { Asset } from '../../src/domain/entities/asset';

const DEFAULT_ID = undefined;
const DEFAULT_NAME = 'fake-asset';
const DEFAULT_URL = 'http://assets.fake.com/bla.zip';

export function createFakeAsset({
  id = DEFAULT_ID,
  name = DEFAULT_NAME,
  url = DEFAULT_URL,
}: { id?: any; name?: any; url?: any } = {}) {
  return new Asset({ name, url }, id);
}
