import classnames from '@sindresorhus/class-names';
import React, { useRef, useState } from 'react';

import { ClearButton, InputWrapper, Prefix, StyledInput, Suffix } from './_styles';

interface Props {
  /** Allow to remove input content with clear icon */
  allowClear?: boolean;

  /** The initial input content */
  defaultValue?: string;

  /** Whether the input is disabled. */
  disabled?: boolean;

  /**
   * The type of input.
   * See: https://developer.mozilla.org/nl/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types
   */
  htmlType?: 'email' | 'password' | 'tel' | 'text' | 'url';

  /** The ID for input */
  id?: string;

  /** Max length */
  maxLength?: number;

  /** Callback when user input */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

  /** The callback function that is triggered when Enter key is pressed. */
  onPressEnter?: () => void;

  /** The input placeholder */
  placeholder?: string;

  /** The prefix icon for the Input. */
  prefix?: React.ReactNode;

  /** The size of the input box. */
  size?: 'large' | 'small';

  /** The suffix icon for the Input. */
  suffix?: React.ReactNode;

  /** The input content value */
  value?: string;
}

const Input = ({
  allowClear,
  defaultValue,
  disabled,
  htmlType = 'text',
  id,
  maxLength,
  onChange: pushChange,
  onPressEnter,
  placeholder,
  prefix,
  size,
  suffix,
  value,
}: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [focus, setFocus] = useState(false);
  const [showClearButton, setShowClearButton] = useState((!!value || !!defaultValue) && allowClear);

  const classes = classnames({
    disabled,
    focus,
    large: size === 'large',
    prefix: !!prefix,
    small: size === 'small',
    suffix: !!suffix || showClearButton,
  });

  const onBlur = () => setFocus(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowClearButton(!!e.target.value && allowClear);
    if (pushChange) pushChange(e);
  };

  const onFocus = () => setFocus(true);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onPressEnter) onPressEnter();
  };

  const clearInput = () => {
    if (inputRef.current) {
      // Workaround to trigger the onChange and change the value
      // See: https://stackoverflow.com/a/46012210/5691156
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )?.set as NonNullable<PropertyDescriptor['set']>;
      nativeInputValueSetter.call(inputRef.current, '');
      const event = new Event('input', { bubbles: true });
      inputRef.current.dispatchEvent(event);
    }
  };

  return (
    <InputWrapper className={classes}>
      {prefix && <Prefix>{prefix}</Prefix>}
      <StyledInput
        data-testid="input"
        defaultValue={defaultValue}
        disabled={disabled}
        id={id}
        maxLength={maxLength}
        onBlur={onBlur}
        onChange={onChange}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        readOnly={!!value && !pushChange}
        ref={inputRef}
        type={htmlType}
        value={value && (maxLength ? value.substr(0, maxLength) : value)}
      />
      {showClearButton && <ClearButton data-testid="inputClearButton" onClick={clearInput} />}
      {suffix && <Suffix>{suffix}</Suffix>}
    </InputWrapper>
  );
};

export default Input;
