import type { Event } from '~root/lib/events/event';

export enum EventTypes {
  CodeRedeemed = 'code.redeemed',
}

export type CodeRedeemedEvent = Event<
  EventTypes.CodeRedeemed,
  { redeemedFor: { kind: 'DownloadToken'; value: string }; redeemer: { email?: string } }
>;
