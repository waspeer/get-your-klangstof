import H2o2 from '@hapi/h2o2';
import { Plugin } from '@hapi/hapi';

import * as Controllers from './hapi-controllers';

const codeRoutes: Plugin<{}> = {
  name: 'downloadCodes',
  version: '0.0.0',
  register: (server) => {
    server.register(H2o2);

    server.route({
      method: 'GET',
      path: '/',
      handler: Controllers.getAllCodes,
    });

    server.route({
      method: 'POST',
      path: '/{code}/redeem',
      handler: Controllers.redeemCode,
    });
  },
};

export default codeRoutes;
