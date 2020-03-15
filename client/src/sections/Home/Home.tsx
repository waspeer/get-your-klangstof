import React from 'react';
import { useParams } from 'react-router-dom';
import { useMachine } from '@xstate/react';

import { Form, HomeWrapper } from './_styles';
import Button from '../../shared/Button';
import Input from '../../shared/Input';
import { Title, Paragraph } from '../../shared/Typography';
import codeMachine from './codeMachine';

interface Params {
  code?: string;
}

const Home = () => {
  const { code: initialCode } = useParams<Params>();

  const [current, send] = useMachine(codeMachine, {
    devTools: true,
    context: { code: initialCode || '' },
  });

  const { code } = current.context;

  const isValid = !code.trim().length;

  const onCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    send({
      type: 'INPUT',
      value: e.target.value,
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    send('SUBMIT');
  };

  return (
    <HomeWrapper>
      <Title>
        Get Your Klangstof{' '}
        <span role="img" aria-label="sparkle">
          ✨
        </span>
      </Title>
      <Paragraph>Redeem your download code here and get your Klangstof on!</Paragraph>
      <Form onSubmit={onSubmit}>
        <Input
          autoFocus
          className="input"
          disabled={current.matches('pending')}
          onChange={onCodeChange}
          placeholder="Downloadcode..."
          size="large"
          value={code}
        />
        <Button
          disabled={isValid}
          loading={current.matches('pending')}
          size="large"
          type="primary"
          htmlType="submit"
        >
          Download
        </Button>
      </Form>
    </HomeWrapper>
  );
};

export default Home;
