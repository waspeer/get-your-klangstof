import { Plugin } from '@hapi/hapi';

import * as Controllers from './hapi-controllers';

const codeRoutes: Plugin<{}> = {
  name: 'downloadCodes',
  version: '0.0.0',
  register: (server) => {
    // server.route({
    //   method: 'GET',
    //   path: '/',
    //   handler: Controllers.getAllCodes,
    // });

    server.route({
      method: 'POST',
      path: '/redeem',
      handler: Controllers.redeemCode,
    });
  },
};

export default codeRoutes;
