const { API_URL } = process.env;

if (!API_URL) {
  throw new Error('API_URL must be set in environment variables');
}

/**
 * REQUEST
 */

type RequestConfig = Omit<RequestInit, 'body'> & { body?: any };

// interface ErrorResponse<T extends string = string> {
//   statusCode: number;
//   error: T;
//   message: string;
// }

async function request<T extends Record<string, any> = Record<string, any>>(
  endpoint: string,
  { body, ...customConfig }: RequestConfig = {},
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
    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  });
}

/**
 * REDEEM CODE
 */

interface RedeemCodePayload {
  downloadLink: string;
}

export type RedeemCodeErrors =
  | 'CodeNotFoundError'
  | 'AssociatedAssetNotFoundError'
  | 'CodeAlreadyRedeemedError'
  | 'UnexpectedError';

export async function redeemCode(code: string) {
  return request<RedeemCodePayload>(`codes/${code}/redeem`, {
    method: 'POST',
  });
}

export async function redeemCodeWithEmail(code: string, email: string) {
  return request<RedeemCodePayload>(`codes/${code}/redeem`, {
    method: 'POST',
    body: {
      redeemer: { email },
    },
  });
}
