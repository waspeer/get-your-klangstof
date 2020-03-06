import Hapi from '@hapi/hapi';
import 'colors';

const port = process.env.PORT || '8000';

const server = new Hapi.Server({
  host: 'localhost',
  port,
});

server.route({
  method: 'GET',
  path: '/',
  handler: () => 'hello world!',
});

export const init = async () => {
  await server.initialize();
  return server;
};

export const start = async () => {
  await server.start();
  console.log(`Server is running at: ${server.info.uri}`.yellow.bold);
  return server;
};
