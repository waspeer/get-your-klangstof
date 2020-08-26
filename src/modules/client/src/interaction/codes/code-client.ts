/**
 * TYPES
 */

// REDEEM CODE
export type RedeemCodeErrors =
  | 'CodeNotFoundError'
  | 'AssociatedAssetNotFoundError'
  | 'CodeAlreadyRedeemedError'
  | 'UnexpectedError'
  | 'ValidationError';

export interface RedeemCodePayload {
  downloadLink: string;
}

// VALIDATE DOWNLOAD
export type ValidateDownloadErrors =
  | 'InvalidTokenError'
  | 'TokenExpiredError'
  | 'AssociatedAssetNotFoundError'
  | 'UnexpectedError';

export interface ValidateDownloadErrorResponse {
  statusCode: number;
  error: ValidateDownloadErrors;
  message: string;
}

export type ValidateDownloadPayload = true | ValidateDownloadErrorResponse;

/**
 * CLIENT
 */

type ClientConfig = Omit<RequestInit, 'body'> & { body?: any };

const { API_URL } = process.env;

if (!API_URL) {
  throw new Error('API_URL must be set in environment variables');
}

export async function codeClient<T extends Record<string, any> = Record<string, any>>(
  endpoint: string,
  { body, ...customConfig }: ClientConfig = {},
): Promise<T> {
  const url = new URL(endpoint, API_URL);
  const headers: HeadersInit = { 'content-type': 'application/json' };
  const config: RequestInit = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  return fetch(url.toString(), config).then(async (response) => {
    if (customConfig.method === 'HEAD') {
      return response;
    }

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  });
}

/**
 * HOOK
 */

interface Props {
  client<T extends Record<string, any>>(endpoint: string, config?: ClientConfig): Promise<T>;
}

export function useCode({ client }: Props = { client: codeClient }) {
  return {
    // REDEEM CODE
    redeemCode(code: string) {
      return client<RedeemCodePayload>(`codes/${code}/redeem`, {
        method: 'POST',
      });
    },

    redeemCodeWithEmail(code: string, email: string) {
      return client<RedeemCodePayload>(`codes/${code}/redeem`, {
        method: 'POST',
        body: { redeemer: { email } },
      });
    },

    // DOWNLOAD
    createDownloadLink(token: string) {
      return new URL(`download/${token}`, API_URL).toString();
    },

    async validateDownload(token: string) {
      const url = `download/${token}`;
      const { ok } = await client<Response>(url, {
        method: 'HEAD',
      });

      if (ok) {
        return true;
      }

      return client<ValidateDownloadErrorResponse>(`download/${token}`);
    },
  };
}
