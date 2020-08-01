declare module 'sentencer' {
  export default class Sentencer {
    static configure(options: {
      /**
       * The list of nouns to use. Sentencer provides its own if you don't have one!
       */
      nounList: string[];

      /**
       * The list of adjectives to use. Again, Sentencer comes with one!
       */
      adjectiveList: string[];

      /**
       * Additional actions for the template engine to use.
       * You can also redefine the preset actions here if you need to.
       */
      actions: Record<string, (...args: any[]) => string>;
    }): void;

    static make(template: string): string;
  }
}
