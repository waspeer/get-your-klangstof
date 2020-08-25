/* eslint-disable react/require-default-props */
import classNames from '@sindresorhus/class-names';
import React from 'react';
import s from './face.css';

interface FaceProps {
  /** Between 0 - 1 */
  intensity: number;

  /** Maximum mouth height in px */
  maxMouthSize?: number;

  /** Minimum mouth height in px */
  minMouthSize?: number;

  /** Whether the face is happy or sad */
  status: 'happy' | 'sad' | 'cheering' | 'waiting';
}

export const Face = ({ intensity, minMouthSize = 10, maxMouthSize = 40, status }: FaceProps) => {
  const mouthSize = intensity * (maxMouthSize - minMouthSize) + minMouthSize;

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
};
