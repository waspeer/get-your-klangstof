import { Error } from '~root/lib/errors/error';

export class AssetNotFoundError extends Error {
  public constructor(assetId: string) {
    super(`Unable to find asset with id '${assetId}'`, AssetNotFoundError);
  }
}
