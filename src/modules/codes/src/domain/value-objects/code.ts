import Sentencer from 'sentencer';

interface Props {
  assetName: string;
  used: number;
  value: string;
}

type ConstructorProps = Pick<Props, 'assetName'> & Partial<Omit<Props, 'assetName'>>;

export class Code {
  public static readonly MaxUseAmount = 1;

  private readonly props: Props;

  public constructor({
    assetName,
    used = 0,
    value = Sentencer.make('{{ adjective }}-{{ adjective }}-{{ noun }}'),
  }: ConstructorProps) {
    this.props = { assetName, used, value };
  }

  public get assetName() {
    return this.props.assetName;
  }

  public get isValid() {
    return this.props.used <= Code.MaxUseAmount;
  }

  public get used() {
    return this.props.used;
  }

  public get value() {
    return this.props.value;
  }
}
