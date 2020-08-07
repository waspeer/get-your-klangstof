import classNames from '@sindresorhus/class-names';
import React, { useEffect, useState } from 'react';
import s from './form-header.css';

/**
 * FACE
 */

interface FaceProps {
  happy: boolean;
  /** Between 0 - 1 */
  intensity: number;
}

const MIN_MOUTH_SIZE = 10;
const MAX_MOUTH_SIZE = 40;

const Face = ({ happy = true, intensity = 0 }: FaceProps) => {
  const mouthSize = intensity * (MAX_MOUTH_SIZE - MIN_MOUTH_SIZE) + MIN_MOUTH_SIZE;

  return (
    <div className={s.face}>
      <div className={classNames(s.mouth, happy && s.happy)} style={{ height: mouthSize }} />
    </div>
  );
};

/**
 * FORMHEADER
 */

interface FormHeaderProps {
  inputLength: number;
  lastEditedInput: string;
}

const INPUT_LENGTH_ESTIMATE = 25;

const generalEncouragements = ['Look at you typing!', "You're doing great!", "Don't give up!"];

const getRandomArrayItem = (array: any[]) => array[Math.floor(Math.random() * array.length)];

const getRandomEncouragement = () => getRandomArrayItem(generalEncouragements);

export const FormHeader = ({ inputLength, lastEditedInput }: FormHeaderProps) => {
  const smileIntensity = inputLength === 0 ? 0 : Math.min(inputLength / INPUT_LENGTH_ESTIMATE, 1);
  const [encouragement, setEncouragement] = useState(getRandomEncouragement());

  useEffect(() => {
    if (inputLength % 5 === 0) {
      setEncouragement(getRandomEncouragement());
    }
  }, [inputLength]);

  return (
    <div className={s.wrapper}>
      <div className={classNames(s.titleWrapper, !inputLength && s.visible)}>
        <h1 className={s.title}>Get your Klangstof</h1>
      </div>
      <div className={classNames(s.faceWrapper, !!inputLength && s.visible)}>
        <Face intensity={smileIntensity} />
        <div className={s.encouragement}>{encouragement}</div>
      </div>
    </div>
  );
};
