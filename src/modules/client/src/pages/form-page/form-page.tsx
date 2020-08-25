import React from 'react';
import { useCode } from '../../interaction/codes/code-client';
import { Form } from './sections';

export const FormPage = () => {
  const { redeemCode, redeemCodeWithEmail } = useCode();

  return (
    <main>
      <Form
        actions={{
          redeemCode,
          redeemCodeWithEmail,
        }}
      />
    </main>
  );
};
