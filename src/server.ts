import H2o2 from '@hapi/h2o2';
import Hapi from '@hapi/hapi';
import 'colors';

import { codeRoutes } from '#root/modules/code';

const port = process.env.PORT || '8000';

const { RESOURCE_URL } = process.env;

const createServer = async () => {
  const server = new Hapi.Server({
    host: '0.0.0.0',
    port,
  });

  server.register(H2o2);

  server.register(codeRoutes, { routes: { prefix: '/codes' } });

  server.route({
    method: 'GET',
    path: '/test',
    handler: (_req, h) => {
      return h.proxy({
        uri: RESOURCE_URL,
        onResponse: (err, res, _req, h) => {
          if (err || res.statusCode !== 200) {
            return h.response('not found').code(404);
          }

          // @todo get resource name

          res.headers = {
            ...res.headers,
            'content-disposition': 'attachment; filename=bla.zip',
          };
          return res;
        },
      });
    },
  });

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
