import jwt, { TokenExpiredError as JWTTokenExpiredError } from 'jsonwebtoken';
import { InvalidTokenError } from '../errors/invalid-token-error';
import { TokenExpiredError } from '../errors/token-expired-error';
import { getEnvironmentVariable } from '~root/lib/helpers/get-environment-variable';

interface Payload {
  assetName: string;
}

const JWT_SECRET = getEnvironmentVariable('JWT_SECRET');

export class DownloadToken {
  public static readonly ExpiresIn = '1h';

  public readonly value: string;

  public constructor(args: string | Payload) {
    if (typeof args === 'string') {
      this.value = args;
    } else {
      this.value = jwt.sign(args, JWT_SECRET, {
        expiresIn: DownloadToken.ExpiresIn,
      });
    }
  }

  public verify() {
    try {
      const payload = jwt.verify(this.value, JWT_SECRET) as Payload;

      if (!payload.assetName) {
        throw new InvalidTokenError();
      }

      return payload;
    } catch (error) {
      if (error instanceof JWTTokenExpiredError) {
        throw new TokenExpiredError();
      }

      throw new InvalidTokenError();
    }
  }
}
