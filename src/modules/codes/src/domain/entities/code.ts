import assert from 'assert';
import Sentencer from 'sentencer';
import { CodeRedeemedEvent } from '../events/code-redeemed-event';
import { DownloadToken } from '../value-objects/download-token';
import { Redeemer } from './redeemer';
import { EventTypes } from '~root/events/event-types';
import { AggregateRoot } from '~root/lib/domain/aggregate-root';
import { UUID } from '~root/lib/domain/uuid';

interface Props {
  assetName: string;
  used: number;
  useLimit: number;
}

type ConstructorProps = Pick<Props, 'assetName'> & Partial<Omit<Props, 'assetName'>>;

const generateCode = () => Sentencer.make('{{ adjective }}-{{ adjective }}-{{ noun }}');

export class Code extends AggregateRoot<Props, EventTypes.CodeRedeemed> {
  public constructor({ assetName, used = 0, useLimit = 5 }: ConstructorProps, id?: UUID) {
    super({ assetName, used, useLimit }, id ?? new UUID(generateCode()));
  }

  public get assetName() {
    return this.props.assetName;
  }

  public get canBeRedeemed() {
    return this.used < this.useLimit;
  }

  public get used() {
    return this.props.used;
  }

  public get useLimit() {
    return this.props.useLimit;
  }

  public redeemForDownloadToken(redeemer?: Redeemer) {
    assert(this.canBeRedeemed, `Code cannot be used more than ${this.useLimit} time(s)`);

    this.props.used += 1;

    const token = new DownloadToken({
      assetName: this.assetName,
    });

    this.events.add(new CodeRedeemedEvent({ code: this, redeemedFor: token, redeemer }));

    return token;
  }
}
