const { API_URL } = process.env;

if (!API_URL) {
  throw new Error('API_URL must be set in environment variables');
}

/**
 * CLIENT
 */

type ClientConfig = Omit<RequestInit, 'body'> & { body?: any };

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

export interface RedeemCodePayload {
  downloadLink: string;
}

export type RedeemCodeErrors =
  | 'CodeNotFoundError'
  | 'AssociatedAssetNotFoundError'
  | 'CodeAlreadyRedeemedError'
  | 'UnexpectedError';

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
  };
}
