import Hapi from '@hapi/hapi';
import 'colors';

import { codeRoutes } from '#root/modules/code';

const API_PREFIX = '/api/v1';
const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || '8000';

export const createServer = async () => {
  const server = new Hapi.Server({ host: HOST, port: PORT });
  await server.register(codeRoutes, { routes: { prefix: `${API_PREFIX}/codes` } });
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
