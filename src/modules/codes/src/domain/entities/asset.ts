import { Code } from '../value-objects/code';
import { AggregateRoot } from '~root/lib/domain/aggregate-root';
import type { UUID } from '~root/lib/domain/uuid';

interface Props {
  codes: Code[];
  name: string;
  url: string;
}

type ConstructorProps = Omit<Props, 'codes'> & Partial<Pick<Props, 'codes'>>;

export class Asset extends AggregateRoot<Props> {
  public constructor({ codes = [], ...rest }: ConstructorProps, id?: UUID) {
    super({ codes, ...rest }, id);
  }

  get codes() {
    return this.props.codes;
  }

  get name() {
    return this.props.name;
  }

  get url() {
    return this.props.url;
  }

  public generateCodes(options: { amount?: number } = {}) {
    const { amount = 10 } = options;
    const codes = [...Array(amount)].map(() => new Code({ assetName: this.name }));

    this.props.codes.push(...codes);
  }
}
