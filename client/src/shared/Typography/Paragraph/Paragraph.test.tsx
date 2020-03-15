import { render } from '@testing-library/react';
import React from 'react';

import Paragraph from './Paragraph';
import { ThemeProvider } from '../../../style';

const renderWithContext = (e: React.ReactNode) => render(<ThemeProvider>{e}</ThemeProvider>);

describe('Paragraph', () => {
  it('should render the provided children', () => {
    const text = 'Blah';
    const { getByText } = renderWithContext(<Paragraph>{text}</Paragraph>);
    expect(getByText(text)).toBeInTheDocument();

    const elementTestId = 'element';
    const { getByTestId } = renderWithContext(
      <Paragraph>
        <span data-testid={elementTestId} />
      </Paragraph>,
    );
    expect(getByTestId(elementTestId)).toBeInTheDocument();
  });
});
