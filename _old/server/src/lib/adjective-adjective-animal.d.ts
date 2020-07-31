declare module 'adjective-adjective-animal' {
  type Format =
    | 'upper'
    | 'lower'
    | 'sentence'
    | 'title'
    | 'camel'
    | 'pascal'
    | 'snake'
    | 'param'
    | 'dot'
    | 'path'
    | 'constant'
    | 'swap'
    | 'ucFirst'
    | 'lcFirst';

  interface Options {
    adjectives: number;
    format: Format;
  }

  function generate(numAdjectives?: number): Promise<string>;

  function generate(format?: Format): Promise<string>;

  function generate(options?: Options): Promise<string>;

  export default generate;
}
