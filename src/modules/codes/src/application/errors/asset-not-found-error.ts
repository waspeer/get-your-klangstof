import { Error } from '~root/lib/errors/error';

export class AssetNotFoundError extends Error {
  public constructor(assetName: string) {
    super(`Unable to find asset with name '${assetName}'`, AssetNotFoundError);
  }
}
