import { useMachine } from '@xstate/react';
import { isMobile } from 'react-device-detect';
import { assign, Machine } from 'xstate';
import type {
  RedeemCodeErrors,
  RedeemCodePayload,
} from '../../../../interaction/codes/code-client';
import { getRandomArrayItem } from '../../../../lib/util/get-random-array-item';

/**
 * CONSTANTS
 */

const generalEncouragements = ['Look at you typing!', "You're doing great!", "Don't give up!"];
const specificEncouragements = {
  code: ["You've got my favorite code!", 'This code was made for you!'],
  email: ['You have the best email address!', 'That email address rocks!'],
};

/**
 * SHARED FUNCTIONS
 */

const getRandomEncouragement = (inputKey?: keyof typeof specificEncouragements) =>
  getRandomArrayItem(
    generalEncouragements.concat(inputKey ? specificEncouragements[inputKey] : []),
  );

const mapErrorTypeToMessage = (errorType: RedeemCodeErrors) => {
  switch (errorType) {
    case 'CodeNotFoundError':
      return 'Code not recognized... Typo?';
    case 'AssociatedAssetNotFoundError':
      return 'Something went wrong internally. Email us at klangstof@gmail.com.';
    case 'CodeAlreadyRedeemedError':
      return 'This code has already been used...';
    default:
      return 'An unexpected error occurred...';
  }
};

const formIsValid = ({ form, formType }: Context) =>
  !!form.code && (formType === 'email' ? !!form.email : true);

/**
 * STATE MACHINE
 */

interface Context {
  form: {
    code: string;
    email: string;
  };
  formType: 'direct' | 'email';
  downloadLink: string | null;
  faceStatus: 'happy' | 'sad' | 'cheering';
  message: string;
}

interface StateSchema {
  states: {
    idle: {
      states: {
        initial: {};
        error: {};
      };
    };
    submitting: {};
    success: {};
  };
}

type Event = { type: 'input'; key: keyof Context['form']; value: string } | { type: 'submit' };

const codeFormMachine = Machine<Context, StateSchema, Event>({
  id: 'codeForm',
  context: {
    form: {
      code: '',
      email: '',
    },
    formType: 'email',
    faceStatus: 'happy',
    message: getRandomEncouragement(),
    downloadLink: null,
  },
  initial: 'idle',
  states: {
    idle: {
      initial: 'initial',
      on: {
        input: {
          target: '.initial',
          actions: assign({
            form: ({ form }, { key, value }) => ({ ...form, [key]: value }),
            message: ({ form, message }, { key }) =>
              (form.code.length + form.email.length) % 5 === 0
                ? getRandomEncouragement(key)
                : message,
          }),
        },
        submit: {
          target: 'submitting',
          cond: formIsValid,
        },
      },
      states: {
        initial: {
          entry: assign({ faceStatus: 'happy' } as any),
        },
        error: {
          entry: assign({ faceStatus: 'sad' } as any),
          exit: assign({ message: getRandomEncouragement() } as any),
        },
      },
    },
    submitting: {
      entry: assign({ message: 'Loading...', faceStatus: 'waiting' } as any),
      invoke: {
        src: 'redeemCode',
        onDone: {
          actions: assign({ downloadLink: (_ctx, { data }) => data.downloadLink }),
          target: 'success',
        },
        onError: {
          actions: assign({ message: (_ctx, { data }) => mapErrorTypeToMessage(data.error) }),
          target: 'idle.error',
        },
      },
    },
    success: {
      entry: assign({ faceStatus: 'cheering', message: 'Yay!!' } as any),
    },
  },
});

/**
 * HOOK
 */

interface Props {
  redeemCode: (code: string) => Promise<RedeemCodePayload>;
  redeemCodeWithEmail: (code: string, email: string) => Promise<RedeemCodePayload>;
}

export const useCodeForm = ({ redeemCode, redeemCodeWithEmail }: Props) => {
  const [state, send] = useMachine(codeFormMachine, {
    context: {
      formType: isMobile ? 'email' : 'direct',
    },
    services: {
      redeemCode: (ctx) =>
        ctx.formType === 'email'
          ? redeemCodeWithEmail(ctx.form.code, ctx.form.email)
          : redeemCode(ctx.form.code),
    },
    devTools: process.env.NODE_ENV === 'development',
  });

  return {
    models: {
      downloadLink: state.context.downloadLink,
      faceStatus: state.context.faceStatus,
      form: {
        code: state.context.form.code,
        email: state.context.form.email,
        inputLength: state.context.form.code.length + state.context.form.email.length,
      },
      formIsValid: formIsValid(state.context),
      formType: state.context.formType,
      message: state.context.message,
      status: state.value,
    },

    operations: {
      handleCodeInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        send({ type: 'input', key: 'code', value: e.target.value });
      },
      handleEmailInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        send({ type: 'input', key: 'email', value: e.target.value });
      },
      handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        send({ type: 'submit' });
      },
    },
  };
};
