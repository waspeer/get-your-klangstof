/* eslint-disable react/require-default-props */
import classNames from '@sindresorhus/class-names';
import React from 'react';
import Confetti from 'react-dom-confetti';
import { Face } from '../../../../lib/components/face';
import s from './form.css';
import { useCodeForm } from './use-form';
import type { RedeemCodePayload } from '~root/modules/client/src/interaction/codes/code-client';

interface Props {
  actions: {
    redeemCode: (code: string) => Promise<RedeemCodePayload>;
    redeemCodeWithEmail: (code: string, email: string) => Promise<RedeemCodePayload>;
  };
  inputLengthEstimate?: number;
}

export const Form = ({ inputLengthEstimate = 25, actions }: Props) => {
  const { models, operations } = useCodeForm(actions);
  const { handleCodeInputChange, handleEmailInputChange, handleSubmit } = operations;

  const formLengthEstimate = inputLengthEstimate * (models.formType === 'email' ? 2 : 1);
  const smileIntensity = Math.min(models.form.inputLength / formLengthEstimate, 1);

  return (
    <div className={s.container}>
      <div className={s.top}>
        <div className={classNames(s.titleWrapper, !models.form.inputLength && s.visible)}>
          <h1 className={s.title}>Get your Klangstof</h1>

          {models.formType === 'email' && (
            <div className={s.mobileDisclaimer}>
              It seems like you’re on a mobile device. Most mobile devices won’t let you download
              files, so we’ll email you a link instead that you can open on a computer.
            </div>
          )}
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
            <div className={s.text}>
              {models.status === 'direct'
                ? 'Fill in your download-code and press enter'
                : 'Fill in your download-code below'}
            </div>
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
                  <button
                    disabled={!models.formIsValid || models.status === 'submitting'}
                    type="submit"
                  >
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

                {models.formType === 'direct' && (
                  <span>
                    <a download href={models.downloadLink!}>
                      Click here
                    </a>{' '}
                    to start your download...
                  </span>
                )}

                {models.formType === 'email' && <span>You&apos;ve got mail!</span>}

                <span role="img" aria-label="party popper">
                  🎉
                </span>
              </span>
            </div>
          )}
        </div>

        <div className={s.confettiWrapper}>
          <Confetti active={models.status === 'success'} />
        </div>
      </div>
    </div>
  );
};
