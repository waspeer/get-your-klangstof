import { Asset } from '../../src/domain/entities/asset';

const DEFAULT_NAME = 'fake-asset';
const DEFAULT_URL = 'http://assets.fake.com/bla.zip';

function createFakeAsset({
  name = DEFAULT_NAME,
  url = DEFAULT_URL,
}: { id?: any; name?: any; url?: any } = {}) {
  return new Asset({ name, url });
}

createFakeAsset.DefaultName = DEFAULT_NAME;
createFakeAsset.DefaultUrl = DEFAULT_URL;

export { createFakeAsset };
