import { Code } from './code';
import { AggregateRoot } from '~root/lib/domain/aggregate-root';
import { UUID } from '~root/lib/domain/uuid';

interface Props {
  codes: Code[];
  url: string;
}

type ConstructorProps = Omit<Props, 'codes'> & Partial<Pick<Props, 'codes'>> & { name: string };

export class Asset extends AggregateRoot<Props> {
  public constructor({ codes = [], name, url }: ConstructorProps) {
    super({ codes, url }, new UUID(name));
  }

  get codes() {
    return this.props.codes;
  }

  get name() {
    return this.id.value;
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
