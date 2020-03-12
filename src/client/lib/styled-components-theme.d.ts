declare module 'styled-components-theme' {
  interface Selector {
    (key: string): string;
    negate: () => string;
    lighten: (amount: number) => string;
    darken: (amount: number) => string;
    saturate: (amount: number) => string;
    desaturate: (amount: number) => string;
    greyscale: () => string;
    whiten: (amount: number) => string;
    blacken: (amount: number) => string;
    fade: (amount: number) => string;
    opaquer: (amount: number) => string;
    rotate: (amount: number) => string;
    mix: (color: string, amount: number) => string;
  }

  declare function createTheme<T extends string[]>(...colors: T): Record<T, Selector>;

  export default createTheme;
}
