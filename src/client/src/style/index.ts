import createTheme from 'styled-components-theme';

import { colors } from './theme';

const colorSelectors = createTheme(...Object.keys(colors));

export { default as ThemeProvider } from './ThemeProvider';
export { colorSelectors as colors };
