import Color from 'color';

import * as theme from './theme';

interface ColorSelectorArgs {
  theme: typeof theme;
}

interface Selector {
  (p: ColorSelectorArgs): string;
}

interface ColorUtilities {
  fade: (amount: number) => Selector;
  lighten: (amount: number) => Selector;
}

type SelectorWithUtilities = Selector & ColorUtilities;

const manipulators = ['fade', 'lighten'] as const;

const colorNames = Object.keys(theme.colors) as (keyof typeof theme.colors)[];

const colorSelectors = colorNames.reduce((acc, colorName) => {
  const selector = (({ theme }: ColorSelectorArgs) =>
    theme.colors[colorName]) as SelectorWithUtilities;

  manipulators.forEach((manipulator) => {
    selector[manipulator] = (...args: Parameters<ColorUtilities[typeof manipulator]>) => ({
      theme,
    }: ColorSelectorArgs) =>
      Color(theme.colors[colorName])
        [manipulator](...args)
        .string();
  });

  acc[colorName] = selector;

  return acc;
}, {} as Record<keyof typeof theme.colors, SelectorWithUtilities>);

export default colorSelectors;
