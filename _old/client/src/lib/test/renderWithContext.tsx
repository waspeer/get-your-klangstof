import React from 'react';
import { render } from '@testing-library/react';

import { ThemeProvider } from '#root/style';

const renderWithContext = (e: React.ReactNode) => render(<ThemeProvider>{e}</ThemeProvider>);

export default renderWithContext;
