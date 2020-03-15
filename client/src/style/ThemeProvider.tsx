import React from 'react';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { Normalize } from 'styled-normalize';

import * as theme from './theme';

interface Props {
  children: React.ReactNode;
}

const GlobalStyle = createGlobalStyle`
  body, html, #root {
    height: 100%
  }

  body {
    background-color: ${theme.colors.background};
    color: ${theme.colors.dark};
    font-family: ${theme.fontFamily};
  }
`;

const Theme = ({ children }: Props) => {
  return (
    <ThemeProvider theme={theme}>
      <Normalize />
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
};

export default Theme;
