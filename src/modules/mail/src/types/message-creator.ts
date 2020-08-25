import type { Message } from './message';

export interface MessageCreator<T extends Record<string, any>> {
  create(parameters: T): Message;
}

/**
 * DOWNLOAD LINK MESSAGE
 */
interface DownloadLinkParameters {
  token: string;
}

export type DownloadLinkMessageCreator = MessageCreator<DownloadLinkParameters>;
