import type { Code } from '../entities/code';
import type { Redeemer } from '../entities/redeemer';
import type { DownloadToken } from '../value-objects/download-token';
import type { CodeRedeemedEvent as ICodeRedeemedEvent } from '~root/events/event-types';
import { EventTypes } from '~root/events/event-types';

export class CodeRedeemedEvent implements ICodeRedeemedEvent {
  public readonly aggregateId: string;
  public readonly createdAt = new Date();
  public readonly payload: ICodeRedeemedEvent['payload'];
  public readonly type = EventTypes.CodeRedeemed;

  public constructor({
    code,
    redeemedFor,
    redeemer,
  }: {
    code: Code;
    redeemedFor: DownloadToken;
    redeemer?: Redeemer;
  }) {
    this.aggregateId = code.id.value;
    this.payload = {
      redeemedFor: {
        kind: 'DownloadToken',
        value: redeemedFor.value,
      },
      redeemer: {
        email: redeemer?.email.value,
      },
    };
  }
}
