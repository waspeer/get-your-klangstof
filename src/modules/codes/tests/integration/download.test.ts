import http from 'http';
import jwt from 'jsonwebtoken';
import portfinder from 'portfinder';
import { createFakeAsset } from '../util/create-fake-asset';
import { createTestContainer } from '../util/create-test-container';
import { createApiUrl } from '~root/../tests/util/create-api-url';
import { createKoaSupertestAgentFromRouter } from '~root/../tests/util/create-koa-supertest-agent';
import { KoaMiddleware } from '~root/infrastructure/koa/types/koa-middleware';
import { getEnvironmentVariable } from '~root/lib/helpers/get-environment-variable';

const JWT_SECRET = getEnvironmentVariable('JWT_SECRET');

const { container, mockAssetRepository } = createTestContainer();
const router = container.get<KoaMiddleware>('router');
const agent = createKoaSupertestAgentFromRouter(router);

async function startTestServer(port: number) {
  const testServer = await new Promise<http.Server>((resolve) => {
    const server = http
      .createServer((_, res) => {
        res.writeHead(200, {
          'Content-Type': 'text/plain',
          'Content-Length': 4,
        });
        res.write('test');
        res.end();
      })
      .listen(port, () => {
        resolve(server);
      });
  });

  return () =>
    new Promise<void>((resolve, reject) => {
      testServer.close((err) => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
}

describe('Download Asset', () => {
  let TEST_SERVER_PORT: number;
  let stopTestServer: () => Promise<void>;

  beforeAll(async () => {
    TEST_SERVER_PORT = await portfinder.getPortPromise();
    stopTestServer = await startTestServer(TEST_SERVER_PORT);
  });

  afterAll(async () => {
    await stopTestServer();
  });

  it('should create a proxy connection to the asset url when the token is valid', async () => {
    const fakeAsset = createFakeAsset({ url: `http://localhost:${TEST_SERVER_PORT}` });
    const fakeToken = jwt.sign({ assetName: fakeAsset.name }, JWT_SECRET);
    const url = createApiUrl(`/download/${fakeToken}`);

    mockAssetRepository.findByName.mockResolvedValue(fakeAsset);

    // This matches the body of the test server
    await agent.get(url).expect(200, 'test');
  });

  it('should return 403 Forbidden when the provided token is invalid', async () => {
    // invalid token
    await agent.get(createApiUrl(`/download/invalid-token`)).expect(403);

    // expired token
    const expiredToken = jwt.sign({ assetName: 'asset', exp: Date.now() / 1000 - 60 }, JWT_SECRET);
    await agent.get(createApiUrl(`/download/${expiredToken}`)).expect(403);

    // invalid payload
    const invalidToken = jwt.sign({ bla: 'bla' }, JWT_SECRET);
    await agent.get(createApiUrl(`/download/${invalidToken}`)).expect(403);
  });
});
