import classNames from '@sindresorhus/class-names';
import React, { useEffect, useState } from 'react';
import s from './form-header.css';
import type { RedeemCodeErrors } from '~root/modules/client/src/interaction/codes/code-client';

/**
 * FACE
 */

interface FaceProps {
  /** Whether the face is happy or sad */
  happy: boolean;

  /** Between 0 - 1 */
  intensity: number;

  /** Whether smiley is wiggly */
  waiting: boolean;
}

const MIN_MOUTH_SIZE = 10;
const MAX_MOUTH_SIZE = 40;

const Face = ({ happy = true, intensity = 0, waiting = false }: FaceProps) => {
  const mouthSize = intensity * (MAX_MOUTH_SIZE - MIN_MOUTH_SIZE) + MIN_MOUTH_SIZE;

  return (
    <div className={classNames(s.face, waiting && s.waiting)}>
      <div className={classNames(s.mouth, happy && s.happy)} style={{ height: mouthSize }} />
    </div>
  );
};

/**
 * FORMHEADER
 */

interface FormHeaderProps {
  error: RedeemCodeErrors | null;
  inputLength: number;
  lastEditedInput: 'code' | undefined;
  loading: boolean;
}

const INPUT_LENGTH_ESTIMATE = 25;

// TODO clean this up

const generalEncouragements = ['Look at you typing!', "You're doing great!", "Don't give up!"];
const specificEncouragements = {
  code: ["You've got my favorite code!", 'This code was made for you!'],
};

const getRandomArrayItem = (array: any[]) => array[Math.floor(Math.random() * array.length)];

const getRandomEncouragement = (inputKey?: 'code') =>
  getRandomArrayItem(
    generalEncouragements.concat(inputKey ? specificEncouragements[inputKey] : []),
  );

const mapErrorTypeToMessage = (errorType: FormHeaderProps['error']) => {
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

export const FormHeader = ({ error, inputLength, lastEditedInput, loading }: FormHeaderProps) => {
  const smileIntensity = inputLength === 0 ? 0 : Math.min(inputLength / INPUT_LENGTH_ESTIMATE, 1);
  const [message, setMessage] = useState(getRandomEncouragement());
  const [happy, setHappy] = useState(true);

  useEffect(() => {
    if (inputLength % 5 === 0) {
      setMessage(getRandomEncouragement(lastEditedInput));
      setHappy(true);
    }
  }, [inputLength, lastEditedInput]);

  useEffect(() => {
    if (loading) {
      setMessage('Loading...');
      setHappy(true);
    }
  }, [loading]);

  useEffect(() => {
    if (error) {
      setMessage(mapErrorTypeToMessage(error));
      setHappy(false);
    }
  }, [error]);

  return (
    <div className={s.wrapper}>
      <div className={classNames(s.titleWrapper, !inputLength && s.visible)}>
        <h1 className={s.title}>Get your Klangstof</h1>
      </div>
      <div className={classNames(s.faceWrapper, !!inputLength && s.visible)}>
        <Face happy={happy} intensity={smileIntensity} waiting={loading} />
        <div className={s.encouragement}>{message}</div>
      </div>
    </div>
  );
};
