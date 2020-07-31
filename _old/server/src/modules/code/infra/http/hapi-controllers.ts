import Boom from '@hapi/boom';
import Hoek from '@hapi/hoek';
import { Request, ResponseToolkit } from '@hapi/hapi';

import CodeMapper from '../../mappers/code-mapper';
import getAllCodesFeature from '../../features/get-all-codes';
import redeemCodeFeature from '../../features/redeem-code';
import * as RedeemCodeErrors from '../../features/redeem-code/errors';

/**
 * Get all download codes
 */
export const getAllCodes = async () => {
  const result = await getAllCodesFeature();

  if (result.isFailure()) {
    const { error } = result;
    const response = Boom.internal(error.toString());
    response.reformat(process.env.NODE_ENV === 'development');
    return response;
  }

  const codes = result.value;
  return codes.map(CodeMapper.toDTO);
};

/**
 * Redeem download code
 */
export const redeemCode = async (req: Request, h: ResponseToolkit) => {
  const dto = { code: Hoek.escapeHtml(req.params.code) };
  const result = await redeemCodeFeature(dto);

  if (result.isFailure()) {
    const { error } = result;

    if (error.type === RedeemCodeErrors.ErrorTypes.NotFound) {
      return Boom.notFound(error.message);
    }

    if (error.type === RedeemCodeErrors.ErrorTypes.ExceededLimit) {
      return Boom.forbidden(error.message);
    }

    const response = Boom.internal(error.toString());
    response.reformat(process.env.NODE_ENV === 'development');
    return response;
  }

  const { RESOURCE_URL } = process.env;

  return h.proxy({
    uri: RESOURCE_URL,
    onResponse: (err, res, _req, h) => {
      if (err || res.statusCode !== 200 || !RESOURCE_URL) {
        return h.response('not found').code(404);
      }

      const [, resourceName] = RESOURCE_URL.match(/\/([^/]*?)$/) ?? [null, ''];

      res.headers = {
        ...res.headers,
        'content-disposition': `attachment; filename=${resourceName ?? 'download.zip'}`,
      };
      return res;
    },
  });
};
