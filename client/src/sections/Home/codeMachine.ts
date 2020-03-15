import { assign, Machine } from 'xstate';

import { checkCode } from '#root/lib/api';

interface Context {
  code: string;
  error: null | string;
}

interface InputEvent {
  type: 'INPUT';
  value: string;
}

interface SubmitEvent {
  type: 'SUBMIT';
}

interface ResolveEvent {
  type: 'RESOLVE';
}

interface RejectEvent {
  type: 'REJECT';
}

type Event = InputEvent | SubmitEvent | ResolveEvent | RejectEvent;

const codeMachine = Machine<Context, Event>(
  {
    id: 'code',
    initial: 'idle',
    context: {
      code: '',
      error: null,
    },
    states: {
      idle: {
        on: {
          INPUT: {
            actions: 'input',
          },
          SUBMIT: 'pending',
        },
      },
      pending: {
        invoke: {
          id: 'checkCode',
          src: ({ code }) => checkCode(code),
          onDone: {
            target: 'succes',
          },
          onError: {
            target: 'error',
            actions: assign({ error: (_, e) => e.data.message }),
          },
        },
        on: {
          RESOLVE: 'succes',
          REJECT: 'error',
        },
      },
      succes: {
        type: 'final',
      },
      error: {
        on: {
          INPUT: 'idle',
          SUBMIT: 'pending',
        },
      },
    },
  },
  {
    actions: {
      input: (ctx, e) => {
        if ('value' in e) ctx.code = e.value;
      },
    },
  },
);

export default codeMachine;
