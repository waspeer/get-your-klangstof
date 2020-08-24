import { Redeemer } from '../../../domain/entities/redeemer';
import type { CodeRepository } from '../../../domain/repositories/code-repository';
import { DownloadToken } from '../../../domain/value-objects/download-token';
import { Email } from '../../../domain/value-objects/email';
import { CodeAlreadyRedeemedError } from '../../errors/code-already-redeemed-error';
import type { GetAssetByCodeFeature } from '../queries/get-asset-by-code-feature';
import type { AppDomainEventEmitter } from '~root/events/app-domain-event-emitter';
import type { Feature } from '~root/lib/application/feature';
import type { Logger } from '~root/lib/logger';

interface Dependencies {
  getAssetByCodeFeature: GetAssetByCodeFeature;
  codeRepository: CodeRepository;
  domainEventEmitter: AppDomainEventEmitter;
  logger: Logger;
}

interface Arguments {
  codeId: string;
  redeemerEmail?: string;
}

export class RedeemCodeForDownloadTokenFeature implements Feature<Arguments, DownloadToken> {
  private readonly codeRepository: CodeRepository;
  private readonly domainEventEmitter: AppDomainEventEmitter;
  private readonly getAssetByCodeFeature: GetAssetByCodeFeature;
  private readonly logger: Logger;

  public constructor({
    codeRepository,
    domainEventEmitter,
    getAssetByCodeFeature,
    logger,
  }: Dependencies) {
    this.codeRepository = codeRepository;
    this.domainEventEmitter = domainEventEmitter;
    this.getAssetByCodeFeature = getAssetByCodeFeature;
    this.logger = logger;
  }

  public async execute({ codeId, redeemerEmail }: Arguments) {
    let redeemer: Redeemer | undefined;

    if (redeemerEmail) {
      redeemer = new Redeemer({
        email: new Email(redeemerEmail),
      });
    }

    // This will throw an error if the code or asset are not found
    const asset = await this.getAssetByCodeFeature.execute({ codeId });
    const code = asset.codes.find(({ id }) => id.value === codeId)!;

    if (!code.canBeRedeemed) {
      this.logger.debug('RedeemCodeFeature: Code cannot be redeemed');

      throw new CodeAlreadyRedeemedError(code.useLimit);
    }

    const downloadToken = code.redeemForDownloadToken(redeemer);

    await this.codeRepository.store(code);
    this.domainEventEmitter.emit(code.events.all);

    this.logger.debug('RedeemCodeFeature: code with id %s successfully redeemed', code.id.value);

    return downloadToken;
  }
}
