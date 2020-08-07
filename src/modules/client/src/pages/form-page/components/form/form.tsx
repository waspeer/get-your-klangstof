import React from 'react';
import s from './form.css';

interface Actions {
  handleCodeInputChange: React.ChangeEventHandler<HTMLInputElement>;
}

interface Props {
  codeInput: string;
  actions: Actions;
}

export const Form = ({ codeInput, actions }: Props) => {
  return (
    <div className={s.wrapper}>
      <div className={s.text}>Fill in your download-code and press enter</div>
      <input
        className={s.input}
        onChange={actions.handleCodeInputChange}
        value={codeInput}
        type="text"
      />
    </div>
  );
};
