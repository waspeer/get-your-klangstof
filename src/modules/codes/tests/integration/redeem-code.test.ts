import { createFakeAsset } from '../util/create-fake-asset';
import { createFakeCode } from '../util/create-fake-code';
import { createTestContainer } from '../util/create-test-container';
import { createApiUrl } from '~root/../tests/util/create-api-url';
import { createKoaSupertestAgentFromRouter } from '~root/../tests/util/create-koa-supertest-agent';
import type { KoaMiddleware } from '~root/infrastructure/koa/types/koa-middleware';

const { container, mockAssetRepository, mockCodeRepository } = createTestContainer();
const router = container.get<KoaMiddleware>('router');
const agent = createKoaSupertestAgentFromRouter(router);
const url = createApiUrl('/codes/fake-code/redeem');
const request = () => agent.post(url);

describe('Redeem Code', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return 404 when the code is not found', async () => {
    mockCodeRepository.findById.mockResolvedValue(undefined);

    await request().expect(404);
  });

  it('should return 404 when the asset is not found', async () => {
    const fakeCode = createFakeCode();

    mockCodeRepository.findById.mockResolvedValue(fakeCode);
    mockAssetRepository.findByName.mockResolvedValue(undefined);

    await request().expect(404);
  });

  it('should return 403 Forbidden when the code was already redeemed', async () => {
    const fakeAsset = createFakeAsset();
    const fakeCode = createFakeCode({ used: 1, useLimit: 1 });
    (fakeAsset as any).props.codes = [fakeCode];

    mockCodeRepository.findById.mockResolvedValue(fakeCode);
    mockAssetRepository.findByName.mockResolvedValue(fakeAsset);

    await request().expect(403);
  });

  it('should return a download link when the code is valid', async () => {
    const fakeAsset = createFakeAsset();
    const fakeCode = createFakeCode({ assetName: fakeAsset.name });
    (fakeAsset as any).props.codes = [fakeCode];

    mockCodeRepository.findById.mockResolvedValue(fakeCode);
    mockAssetRepository.findByName.mockResolvedValue(fakeAsset);

    const { body } = await request().expect(200);

    expect(body).toEqual({
      downloadLink: expect.any(String),
    });
  });
});
