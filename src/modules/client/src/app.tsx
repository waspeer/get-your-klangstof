import { Router } from '@reach/router';
import type { RouteComponentProps } from '@reach/router';
import React from 'react';
import { FormPage } from './pages/form-page';
import './styles/global.css';

const Route = (props: { component: JSX.Element } & RouteComponentProps) => props.component;

export const App = () => {
  return (
    <Router>
      <Route component={<FormPage />} path="/" />
    </Router>
  );
};
