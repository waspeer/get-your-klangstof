import classNames from '@sindresorhus/class-names';
import { useMachine } from '@xstate/react';
import React from 'react';
import Confetti from 'react-dom-confetti';
import { assign, Machine } from 'xstate';
import { redeemCode, RedeemCodeErrors } from '../../interaction/codes/code-client';
import { getRandomArrayItem } from '../../lib/util/get-random-array-item';
import s from './form-page.css';

// TODO move useForm hook to seperate file

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

const generalEncouragements = ['Look at you typing!', "You're doing great!", "Don't give up!"];
const specificEncouragements = {
  code: ["You've got my favorite code!", 'This code was made for you!'],
};

const getRandomEncouragement = (inputKey?: 'code') =>
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
              form.code.length % 5 === 0 ? getRandomEncouragement(key) : message,
          }),
        },
        submit: {
          target: 'submitting',
          cond: ({ form, formType }) => !!form.code && (formType === 'email' ? !!form.email : true),
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

const useCodeForm = () => {
  const [state, send] = useMachine(codeFormMachine, {
    services: {
      redeemCode: (ctx) => redeemCode(ctx.form.code),
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
        inputLength: state.context.form.code.length,
      },
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

const INPUT_LENGTH_ESTIMATE = 25;

// TODO inject redeemCode function somewhere else
export const Form = () => {
  const { models, operations } = useCodeForm();
  const { handleCodeInputChange, handleEmailInputChange, handleSubmit } = operations;

  const smileIntensity =
    models.form.inputLength === 0
      ? 0
      : Math.min(models.form.inputLength / INPUT_LENGTH_ESTIMATE, 1);

  return (
    <div className={s.container}>
      <div className={s.top}>
        <div className={classNames(s.titleWrapper, !models.form.inputLength && s.visible)}>
          <h1 className={s.title}>Get your Klangstof</h1>
          <div className={s.mobileDisclaimer}>
            It seems like you’re on a mobile device. Most mobile devices won’t let you download
            files, so we’ll email you a link instead that you can open on a computer.
          </div>
        </div>
        <div className={classNames(s.faceWrapper, !!models.form.inputLength && s.visible)}>
          <Face status={models.faceStatus} intensity={smileIntensity} />
          <div className={s.message}>{models.message}</div>
        </div>
      </div>

      <div className={s.bottom}>
        <div className={s.box}>
          <form
            className={classNames(
              s.form,
              models.status === 'submitting' && s.loading,
              models.status === 'success' && s.hidden,
            )}
            onSubmit={handleSubmit}
          >
            <div className={s.text}>Fill in your download-code and press enter</div>
            <div>
              <input
                disabled={models.status === 'submitting'}
                onChange={handleCodeInputChange}
                placeholder="Download code"
                value={models.form.code}
                type="text"
              />
              {models.formType === 'email' && (
                <>
                  <input
                    disabled={models.status === 'submitting'}
                    onChange={handleEmailInputChange}
                    placeholder="Email"
                    value={models.form.email}
                    type="email"
                  />
                  <button disabled type="submit">
                    REDEEM
                  </button>
                </>
              )}
            </div>
          </form>

          {models.status === 'success' && (
            <div className={s.success}>
              <span>
                <span role="img" aria-label="party popper">
                  🎉
                </span>
                <a download href={models.downloadLink!}>
                  Click here
                </a>{' '}
                to start your download...
                <span role="img" aria-label="party popper">
                  🎉
                </span>
              </span>
            </div>
          )}
        </div>

        <Confetti active={models.status === 'success'} />
      </div>
    </div>
  );
};

// TODO move this to seperate file?

/**
 * FACE
 */

interface FaceProps {
  /** Whether the face is happy or sad */
  status: 'happy' | 'sad' | 'cheering' | 'waiting';

  /** Between 0 - 1 */
  intensity: number;
}

const MIN_MOUTH_SIZE = 10;
const MAX_MOUTH_SIZE = 40;

function Face({ status, intensity }: FaceProps) {
  const mouthSize = intensity * (MAX_MOUTH_SIZE - MIN_MOUTH_SIZE) + MIN_MOUTH_SIZE;

  return (
    <div
      className={classNames(
        s.face,
        status === 'waiting' && s.waiting,
        status === 'cheering' && s.cheering,
      )}
    >
      <div
        className={classNames(s.mouth, status === 'sad' && s.sad)}
        style={{ height: mouthSize }}
      />
    </div>
  );
}
