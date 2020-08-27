import { createFakeAsset } from '../util/create-fake-asset';
import { createTestContainer } from '../util/create-test-container';
import { createApiUrl } from '~root/../tests/util/create-api-url';
import { createKoaSupertestAgentFromRouter } from '~root/../tests/util/create-koa-supertest-agent';
import type { KoaMiddleware } from '~root/infrastructure/koa/types/koa-middleware';
import { getEnvironmentVariable } from '~root/lib/helpers/get-environment-variable';

const ADMIN_USERNAME = getEnvironmentVariable('ADMIN_USERNAME');
const ADMIN_PASSWORD = getEnvironmentVariable('ADMIN_PASSWORD');

const { container, mockAssetRepository } = createTestContainer();

const router = container.get<KoaMiddleware>('router');
const request = createKoaSupertestAgentFromRouter(router);
const createUrl = () => {
  const unique = Date.now().toString();
  return createApiUrl(`/assets/${unique}-resource/generate-codes`);
};
const authenticatedRequest = () => request.post(createUrl()).auth(ADMIN_USERNAME, ADMIN_PASSWORD);

describe('Generating Codes', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be protected with basic authentication', async () => {
    await request.post(createUrl()).expect(401);
    await authenticatedRequest().expect(({ status }) => status !== 401);
  });

  it('should return a 404 if the requested resource is not found', async () => {
    await authenticatedRequest().expect(404);
  });

  it('should generate new codes and store them', async () => {
    const fakeAsset = createFakeAsset();

    jest.spyOn(fakeAsset, 'generateCodes');
    mockAssetRepository.findByName.mockResolvedValue(fakeAsset);

    await authenticatedRequest();

    expect(fakeAsset.generateCodes).toHaveBeenCalled();
    expect(mockAssetRepository.store).toHaveBeenCalledWith(
      expect.objectContaining({ id: fakeAsset.id }),
    );
  });
});
