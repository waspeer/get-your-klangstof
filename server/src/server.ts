import Hapi from '@hapi/hapi';
import 'colors';

import { codeRoutes } from '#root/modules/code';

const port = process.env.PORT || '8000';

const createServer = async () => {
  const server = new Hapi.Server({
    host: '0.0.0.0',
    port,
  });

  server.register(codeRoutes, { routes: { prefix: '/codes' } });

  return server;
};

export const init = async () => {
  const server = await createServer();
  await server.initialize();
  return server;
};

export const start = async () => {
  const server = await createServer();
  await server.start();
  console.log(`Server is running at: ${server.info.uri}`.yellow.bold);
  return server;
};
