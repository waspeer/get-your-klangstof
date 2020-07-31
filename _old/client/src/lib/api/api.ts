import ky from 'ky';

import * as Errors from './errors';
import { Result, ApiResponse } from './types';

const API_PREFIX = process.env.API_PREFIX;

export const checkCode = async (code: string): Promise<Result> => {
  return new Promise(async (resolve, reject) => {
    try {
      await ky.post(`${API_PREFIX}/codes/${code}/redeem`).json<ApiResponse>();
      resolve({ succes: true });
    } catch (e) {
      const res = e.response as Response;
      if (res.status === 404) reject(Errors.notFound);
      reject(Errors.unexpected);
    }
  });
};
