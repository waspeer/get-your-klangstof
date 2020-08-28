import React from 'react';
import { Face } from '../../lib/components/face';
import s from './not-found-page.css';

export const NotFoundPage = () => {
  return (
    <main className={s.wrapper}>
      <Face intensity={1} status="sad" />
      <p>We could&apos;nt find the page you were looking for</p>
    </main>
  );
};
