import Boom from '@hapi/boom';

import CodeMapper from '../../mappers/code-mapper';
import getAllCodesFeature from '../../features/get-all-codes';

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
