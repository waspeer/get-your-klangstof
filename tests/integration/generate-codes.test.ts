import { createApiUrl } from '../util/create-api-url';
import { createKoaSupertestAgent } from '../util/create-koa-supertest-agent';
import { Application } from '~root/infrastructure/application';
import type { KoaServer } from '~root/infrastructure/koa/koa-server';
import { getEnvironmentVariable } from '~root/lib/helpers/get-environment-variable';

const server = Application.container.get<KoaServer>('server');
const request = createKoaSupertestAgent(server);

describe('Generating Codes', () => {
  it('should be protected with basic authentication', async () => {
    const username = getEnvironmentVariable('ADMIN_USERNAME');
    const password = getEnvironmentVariable('ADMIN_PASSWORD');
    const url = createApiUrl('/codes/generate');

    await request.post(url).expect(401);
    await request.post(url).auth(username, password).expect(201);
  });
});
