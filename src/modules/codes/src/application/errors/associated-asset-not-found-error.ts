import { Error } from '~root/lib/errors/error';

export class AssociatedAssetNotFoundError extends Error {
  public constructor(relation: Record<string, string>) {
    const [relationType, relationName] = Object.entries(relation)[0];
    super(
      `Unable to find asset associated with ${relationType} '${relationName}'`,
      AssociatedAssetNotFoundError,
    );
  }
}
