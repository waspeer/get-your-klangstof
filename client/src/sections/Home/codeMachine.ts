import { Machine } from 'xstate';

const codeMachine = Machine(
  {
    id: 'code',
    initial: 'idle',
    context: {
      code: '',
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
        on: {
          RESOLVE: 'resolved',
          REJECT: 'error',
        },
      },
      resolved: {
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
        ctx.code = e.value;
      },
    },
  },
);

export default codeMachine;
