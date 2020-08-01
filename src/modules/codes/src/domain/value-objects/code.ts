interface Props {
  value: string;
}

export class Code {
  public readonly value: string;

  public constructor({ value }: Partial<Props> = {}) {
    // TODO generate actual code
    this.value = value || 'asdfasdfasdf';
  }
}
