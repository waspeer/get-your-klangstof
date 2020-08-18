import classNames from '@sindresorhus/class-names';
import React from 'react';
import s from './form.css';

interface Actions {
  handleCodeInputChange: React.ChangeEventHandler<HTMLInputElement>;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
}

interface Props {
  actions: Actions;
  codeInput: string;
  loading: boolean;
}

export const Form = ({ actions, codeInput, loading }: Props) => {
  return (
    <form className={classNames(s.wrapper, loading && s.loading)} onSubmit={actions.handleSubmit}>
      <div className={s.text}>Fill in your download-code and press enter</div>
      <input
        className={s.input}
        disabled={loading}
        onChange={actions.handleCodeInputChange}
        value={codeInput}
        type="text"
      />
    </form>
  );
};
