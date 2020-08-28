import { asClass, asFunction, asValue, createContainer } from 'awilix';
import type { AwilixContainer } from 'awilix';
import { AfterCodeRedeemed } from './event-handlers/after-code-redeemed';
import { MJMLDownloadLinkMessageCreator } from './message-creators/download-link/mjml-download-link-message-creator';
import { NodemailerMailService } from './nodemailer-mail-service';
import type { NodemailerMailServiceConfig, TransportOptions } from './nodemailer-mail-service';
import type { MailService } from './types/mail-service';
import type { DownloadLinkMessageCreator } from './types/message-creator';
import type { AwilixDIContainer } from '~root/infrastructure/types/awilix-di-container';
import { getEnvironmentVariable } from '~root/lib/helpers/get-environment-variable';

const NODE_ENV = getEnvironmentVariable('NODE_ENV', 'development');

const notImplemented = (name: string) => () => {
  throw new Error(
    `CodesDIContainer: '${name}' is not implemented. Did you forget to implement it in AppDIContainer?`,
  );
};

export class MailDIContainer implements AwilixDIContainer {
  public readonly container: AwilixContainer;

  public constructor() {
    this.container = createContainer();

    this.container.register({
      /**
       * CONFIG
       */
      mailServiceConfig: asValue<NodemailerMailServiceConfig>({
        fromAddress: getEnvironmentVariable('MAIL_RECIPIENT'),
      }),
      transportOptions: asValue<TransportOptions>({
        host: getEnvironmentVariable('SMTP_HOST'),
        port:
          NODE_ENV === 'production'
            ? +getEnvironmentVariable('SMTP_PORT_PROD')
            : +getEnvironmentVariable('SMTP_PORT_DEV'),
        secure: NODE_ENV === 'production',
        auth: {
          user: getEnvironmentVariable('SMTP_USER'),
          pass: getEnvironmentVariable('SMTP_PASSWORD'),
        },
      }),

      /**
       * INFRASTRUCTURE
       */

      // EVENT HANDLERS
      afterCodeRedeemed: asClass(AfterCodeRedeemed),

      // GENERAL
      domainEventEmitter: asFunction(notImplemented),
      logger: asFunction(notImplemented),

      // MAILSERVICE
      mailService: asClass<MailService>(NodemailerMailService),

      // MESSAGE CREATORS
      downloadLinkMessageCreator: asValue<DownloadLinkMessageCreator>(
        MJMLDownloadLinkMessageCreator,
      ),

      /**
       * EXPORTS
       */

      eventHandlers: asFunction(({ afterCodeRedeemed }) => [afterCodeRedeemed]),
    });
  }

  public get<T>(name: string) {
    return this.container.resolve<T>(name, { allowUnregistered: true });
  }
}
