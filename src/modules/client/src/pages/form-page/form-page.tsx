import { useMachine } from '@xstate/react';
import React from 'react';
import { assign, Machine } from 'xstate';
import { FormHeader } from './components';
import { Form } from './components/form';
import s from './form-page.css';

interface Context {
  lastEditedInput: string;
  code: string;
}

interface StateSchema {
  states: {
    idle: {};
  };
}

type Event = { type: 'input'; key: keyof Context; value: string };

const codeFormMachine = Machine<Context, StateSchema, Event>({
  id: 'codeForm',
  context: {
    code: '',
    lastEditedInput: '',
  },
  initial: 'idle',
  states: {
    idle: {
      on: {
        input: {
          actions: assign((_, { key, value }) => ({ lastEditedInput: key, [key]: value })),
        },
      },
    },
  },
});

const useCodeForm = () => {
  const [state, send] = useMachine(codeFormMachine, {
    devTools: process.env.NODE_ENV === 'development',
  });

  return {
    models: {
      form: {
        code: state.context.code,
      },
      lastEditedInput: state.context.lastEditedInput,
    },

    operations: {
      handleCodeInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        send({ type: 'input', key: 'code', value: e.target.value });
      },
    },
  };
};

// TODO rename this to form and rename form component to something like formbody?
export const FormPage = () => {
  const { models, operations } = useCodeForm();
  const { handleCodeInputChange } = operations;

  return (
    <div className={s.container}>
      <FormHeader inputLength={models.form.code.length} lastEditedInput={models.lastEditedInput} />
      <Form
        codeInput={models.form.code}
        actions={{
          handleCodeInputChange,
        }}
      />
    </div>
  );
};
