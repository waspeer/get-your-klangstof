import { createTransport } from 'nodemailer';
import type JSONTransport from 'nodemailer/lib/json-transport';
import type Mail from 'nodemailer/lib/mailer';
import type SendmailTransport from 'nodemailer/lib/sendmail-transport';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import type { MailService } from './types/mail-service';
import type { Message } from './types/message';

export interface NodemailerMailServiceConfig {
  fromAddress: string;
}

export type TransportOptions =
  | SendmailTransport.Options
  | JSONTransport.Options
  | SMTPTransport.Options;

interface Dependencies {
  mailServiceConfig: NodemailerMailServiceConfig;
  transportOptions: TransportOptions;
}

export class NodemailerMailService implements MailService {
  private readonly config: NodemailerMailServiceConfig;
  private readonly transport: Mail;

  public constructor({ mailServiceConfig, transportOptions }: Dependencies) {
    this.config = mailServiceConfig;
    this.transport = createTransport(transportOptions);
  }

  public async send(options: { to: string; message: Message }) {
    const { to, message } = options;

    await this.transport.sendMail({
      html: message.html,
      subject: message.subject,
      from: this.config.fromAddress,
      to,
    });
  }
}
