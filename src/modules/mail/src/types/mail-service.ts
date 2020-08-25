import type { Message } from './message';

export interface MailService {
  send(options: { to: string; message: Message }): Promise<void>;
}
