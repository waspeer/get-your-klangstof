import Boom from '@hapi/boom';
import { Request, ResponseToolkit } from '@hapi/hapi';

import CodeMapper from '../../mappers/code-mapper';
import getAllCodesFeature from '../../features/get-all-codes';
import redeemCodeFeature from '../../features/redeem-code';
import RedeemCodeDTO from '../../features/redeem-code/dto';
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
  const dto = req.payload as RedeemCodeDTO;
  const result = await redeemCodeFeature(dto);

  if (result.isFailure()) {
    const { error } = result;

    if (error.type === RedeemCodeErrors.ErrorTypes.ExceededLimit) {
      return Boom.forbidden(error.message);
    }

    const response = Boom.internal(error.toString());
    response.reformat(process.env.NODE_ENV === 'development');
    return response;
  }

  return h.response().code(204);
};
