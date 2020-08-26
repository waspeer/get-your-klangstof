import { useParams } from '@reach/router';
import React from 'react';
import { useCode } from '../../interaction/codes/code-client';
import { Form } from './sections';

export const FormPage = () => {
  const { redeemCode, redeemCodeWithEmail } = useCode();
  const { code } = useParams();

  return (
    <main>
      <Form
        initialCode={code}
        actions={{
          redeemCode,
          redeemCodeWithEmail,
        }}
      />
    </main>
  );
};
