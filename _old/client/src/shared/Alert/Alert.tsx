import classNames from '@sindresorhus/class-names';
import React, { useState } from 'react';

import { Content, CloseButton, DefaultIcons, Message, Wrapper } from './_styles';

interface Props {
  /** Whether Alert can be closed */
  closable?: boolean;

  /** Additional content of Alert */
  description?: React.ReactNode;

  /** Set default icon or provide a custom one */
  icon?: React.ReactNode | boolean;

  /** Content of Alert */
  message?: React.ReactNode;

  /** Type of Alert */
  type?: 'error' | 'success' | 'warning';
}

const Alert = ({ closable, description, icon, message, type }: Props) => {
  const [closed, setClosed] = useState(false);

  if (closed) return null;

  const classes = classNames({
    error: type === 'error',
    success: type === 'success',
    warning: type === 'warning',
    'with-description': !!description,
  });

  const DefaultIcon = DefaultIcons[type || 'info'];

  const close = () => setClosed(true);

  return (
    <Wrapper className={classes} data-testid="alert">
      {icon === true && <DefaultIcon data-testid="alertIcon" />}
      {icon && icon !== true && icon}
      <Content>
        {message && <Message>{message}</Message>}
        {description && <span>{description}</span>}
      </Content>
      {closable && <CloseButton data-testid="alertCloseButton" onClick={close} />}
    </Wrapper>
  );
};

export default Alert;
