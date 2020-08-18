import classNames from '@sindresorhus/class-names';
import { useMachine } from '@xstate/react';
import React, { useRef, useEffect } from 'react';
import Confetti from 'react-dom-confetti';
import { assign, Machine } from 'xstate';
import { redeemCode, RedeemCodeErrors } from '../../interaction/codes/code-client';
import { getRandomArrayItem } from '../../lib/util/get-random-array-item';
import s from './form-page.css';

// TODO offset inputs?

interface Context {
  code: string;
  downloadLink: string | null;
  error: RedeemCodeErrors | null;
  faceStatus: 'happy' | 'sad' | 'cheering';
  lastEditedInput?: 'code';
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

type Event = { type: 'input'; key: 'code'; value: string } | { type: 'submit' };

const generalEncouragements = ['Look at you typing!', "You're doing great!", "Don't give up!"];
const specificEncouragements = {
  code: ["You've got my favorite code!", 'This code was made for you!'],
};

const getRandomEncouragement = (inputKey?: 'code') =>
  getRandomArrayItem(
    generalEncouragements.concat(inputKey ? specificEncouragements[inputKey] : []),
  );

const mapErrorTypeToMessage = (errorType: Context['error']) => {
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
    code: '',
    error: null,
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
          actions: assign(({ code, message }, { key, value }) => ({
            message: code.length % 5 === 0 ? getRandomEncouragement(key) : message,
            [key]: value,
          })),
        },
        submit: {
          target: 'submitting',
          cond: ({ code }) => !!code,
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
      redeemCode: (ctx) => redeemCode(ctx.code),
    },
    devTools: process.env.NODE_ENV === 'development',
  });

  return {
    models: {
      downloadLink: state.context.downloadLink,
      faceStatus: state.context.faceStatus,
      form: {
        code: state.context.code,
        inputLength: state.context.code.length,
        lastEditedInput: state.context.lastEditedInput,
      },
      message: state.context.message,
      status: state.value,
    },

    operations: {
      handleCodeInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        send({ type: 'input', key: 'code', value: e.target.value });
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
// TODO rename this to form and rename form component to something like formbody?
export const FormPage = () => {
  const { models, operations } = useCodeForm();
  const { handleCodeInputChange, handleSubmit } = operations;

  const smileIntensity =
    models.form.inputLength === 0
      ? 0
      : Math.min(models.form.inputLength / INPUT_LENGTH_ESTIMATE, 1);

  // TODO instead of loading boolean, use state name
  return (
    <div className={s.container}>
      <div className={s.header}>
        <div className={classNames(s.titleWrapper, !models.form.inputLength && s.visible)}>
          <h1 className={s.title}>Get your Klangstof</h1>
        </div>
        <div className={classNames(s.faceWrapper, !!models.form.inputLength && s.visible)}>
          <Face status={models.faceStatus} intensity={smileIntensity} />
          <div className={s.message}>{models.message}</div>
        </div>
      </div>

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
          <input
            autoFocus
            className={s.input}
            disabled={models.status === 'submitting'}
            onChange={handleCodeInputChange}
            value={models.form.code}
            type="text"
          />
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
  );
};

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
