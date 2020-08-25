import { MailService } from '../types/mail-service';
import { MessageCreator } from '../types/message-creator';
import { AppDomainEventEmitter } from '~root/events/app-domain-event-emitter';
import { CodeRedeemedEvent, EventTypes } from '~root/events/event-types';
import { Listener } from '~root/lib/events/listener';
import { Logger } from '~root/lib/logger';

interface Dependencies {
  downloadLinkMessageCreator: MessageCreator<any>; // TODO
  domainEventEmitter: AppDomainEventEmitter;
  logger: Logger;
  mailService: MailService;
}

export class AfterCodeRedeemed extends Listener<CodeRedeemedEvent> {
  public readonly eventType = EventTypes.CodeRedeemed;

  private readonly logger: Logger;
  private readonly mailService: MailService;
  private readonly downloadLinkMessageCreator: MessageCreator<any>; // TODO

  public constructor({
    downloadLinkMessageCreator,
    domainEventEmitter,
    logger,
    mailService,
  }: Dependencies) {
    super({ domainEventEmitter });

    this.logger = logger;
    this.mailService = mailService;
    this.downloadLinkMessageCreator = downloadLinkMessageCreator;
  }

  public async handle(event: CodeRedeemedEvent) {
    await this.sendDownloadLinkEmail(event);
  }

  private async sendDownloadLinkEmail(event: CodeRedeemedEvent) {
    const { redeemedFor, redeemer } = event.payload;

    if (!redeemer.email) {
      this.logger.debug(
        'AfterCodeRedeemed: not sending download link email: no redeemer emailaddress found',
      );

      return;
    }

    if (redeemedFor.kind !== 'DownloadToken') {
      this.logger.debug(
        'AfterCodeRedeemed: not sending download link email: code was not redeemed for token',
      );

      return;
    }

    await this.mailService.send({
      to: redeemer.email,
      message: this.downloadLinkMessageCreator.create({ token: redeemedFor.value }),
    });

    this.logger.debug('AfterCodeRedeemed: download link email successfully sent');
  }
}
