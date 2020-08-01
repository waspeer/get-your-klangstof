import { asValue } from 'awilix';
import { CodesDIContainer } from '../../src/infrastructure/codes-di-container';
import { createMockAssetRepository } from '../mocks/mock-asset-repository';
import { createFakeAsset } from '../util/create-fake-asset';
import { createMockLogger } from '~root/../tests/mocks/mock-logger';
import { createApiUrl } from '~root/../tests/util/create-api-url';
import { createKoaSupertestAgentFromRouter } from '~root/../tests/util/create-koa-supertest-agent';
import type { KoaMiddleware } from '~root/infrastructure/koa/types/koa-middleware';
import { getEnvironmentVariable } from '~root/lib/helpers/get-environment-variable';

const ADMIN_USERNAME = getEnvironmentVariable('ADMIN_USERNAME');
const ADMIN_PASSWORD = getEnvironmentVariable('ADMIN_PASSWORD');

const container = new CodesDIContainer();
const mockAssetRepository = createMockAssetRepository();
const mockLogger = createMockLogger();

container.container.register({
  assetRepository: asValue(mockAssetRepository),
  logger: asValue(mockLogger),
});

const router = container.get<KoaMiddleware>('router');
const request = createKoaSupertestAgentFromRouter(router);
const url = createApiUrl('/assets/test-resource/generate-codes');
const authenticatedRequest = () => request.post(url).auth(ADMIN_USERNAME, ADMIN_PASSWORD);

describe('Generating Codes', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be protected with basic authentication', async () => {
    await request.post(url).expect(401);
    await authenticatedRequest().expect(({ status }) => status !== 401);
  });

  it('should return a 404 if the requested resource is not found', async () => {
    await authenticatedRequest().expect(404);
  });

  it('should generate new codes and store them', async () => {
    const fakeAsset = createFakeAsset();

    jest.spyOn(fakeAsset, 'generateCodes');
    mockAssetRepository.findById.mockResolvedValue(fakeAsset);

    await authenticatedRequest();

    expect(fakeAsset.generateCodes).toHaveBeenCalled();
    expect(mockAssetRepository.store).toHaveBeenCalledWith(
      expect.objectContaining({ id: fakeAsset.id }),
    );
  });
});
