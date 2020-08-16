import assert from 'assert';
import Sentencer from 'sentencer';
import { DownloadToken } from '../value-objects/download-token';
import { Entity } from '~root/lib/domain/entity';
import { UUID } from '~root/lib/domain/uuid';

interface Props {
  assetName: string;
  used: number;
  useLimit: number;
}

type ConstructorProps = Pick<Props, 'assetName'> & Partial<Omit<Props, 'assetName'>>;

const generateCode = () => Sentencer.make('{{ adjective }}-{{ adjective }}-{{ noun }}');

export class Code extends Entity<Props> {
  public constructor({ assetName, used = 0, useLimit = 1 }: ConstructorProps, id?: UUID) {
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

  public redeemForDownloadToken() {
    assert(this.canBeRedeemed, `Code cannot be used more than ${this.useLimit} time(s)`);

    this.props.used += 1;

    return new DownloadToken({
      assetName: this.assetName,
    });
  }
}
