import { useMachine } from '@xstate/react';
import React from 'react';
import { assign, Machine } from 'xstate';
import {
  ValidateDownloadErrors,
  ValidateDownloadPayload,
} from '../../../../interaction/codes/code-client';
import { Face } from '../../../../lib/components/face';
import s from './download-feedback.css';

/**
 * HOOK
 */

interface Context {
  error: ValidateDownloadErrors | 'InvalidLink';
  faceStatus: 'happy' | 'sad' | 'cheering' | 'waiting';
  token: string;
}

interface StateSchema {
  states: {
    idle: {};
    validating: {};
    success: {};
    error: {};
  };
}

// eslint-disable-next-line consistent-return
const mapErrorTypeToMessage = (errorType: Context['error']) => {
  // eslint-disable-next-line default-case
  switch (errorType) {
    case 'InvalidLink':
      return "There's something wrong with this download link.";
    case 'InvalidTokenError':
      return 'This download link does not work! Typo?';
    case 'TokenExpiredError':
      return 'This download link has expired!';
    case 'AssociatedAssetNotFoundError':
    case 'UnexpectedError':
      return 'Something went wrong internally. Email us at klangstof@gmail.com.';
  }
};

const DownloadMachine = Machine<Context, StateSchema>({
  id: 'downloadMachine',
  initial: 'idle',
  states: {
    idle: {
      always: [
        {
          target: 'validating',
          cond: ({ token }) => !!token,
        },
        {
          target: 'error',
          actions: assign<Context>({ error: 'InvalidLink' }),
        },
      ],
    },
    validating: {
      entry: assign<Context>({ faceStatus: 'waiting' }),
      invoke: {
        src: 'validateDownload',
        onDone: {
          target: 'success',
        },
        onError: {
          actions: assign({ error: (_ctx, { data }) => data.error }),
          target: 'error',
        },
      },
    },
    success: {
      entry: assign<Context>({ faceStatus: 'cheering' }),
      type: 'final',
    },
    error: {
      entry: assign<Context>({ faceStatus: 'sad' }),
    },
  },
});

interface HookProps {
  actions: {
    validateDownload: (token: string) => Promise<ValidateDownloadPayload>;
  };
  token: string;
}

function useDownloadFeedback({ actions, token }: HookProps) {
  const { validateDownload } = actions;
  const [state] = useMachine(DownloadMachine, {
    context: { token },
    devTools: process.env.NODE_ENV === 'development',
    services: {
      validateDownload: (ctx) => validateDownload(ctx.token),
    },
  });

  return {
    models: {
      error: mapErrorTypeToMessage(state.context.error),
      faceStatus: state.context.faceStatus,
      state: state.value,
    },
  };
}

/**
 * COMPONENT
 */

interface Props {
  actions: {
    createDownloadLink: (token: string) => string;
    validateDownload: (token: string) => Promise<ValidateDownloadPayload>;
  };
  token: string;
}

export const DownloadFeedback = ({ actions, token }: Props) => {
  const { models } = useDownloadFeedback({ actions, token });

  return (
    <div className={s.wrapper}>
      <Face intensity={1} status={models.faceStatus} />

      <div className={s.message}>
        {models.state === 'validating' && 'Checking your download...'}
        {models.state === 'error' && models.error}
        {models.state === 'success' && (
          <>
            All set!{' '}
            <a download href={actions.createDownloadLink(token)}>
              Click here
            </a>{' '}
            to start downloading
          </>
        )}
      </div>
    </div>
  );
};
