import { Router } from '@reach/router';
import type { RouteComponentProps } from '@reach/router';
import React from 'react';
import { FormPage, DownloadPage } from './pages';
import './styles/global.css';

const Route = ({
  component: Component,
}: { component: () => JSX.Element } & RouteComponentProps) => <Component />;

export const App = () => {
  return (
    <Router>
      <Route component={FormPage} path="/" />
      <Route component={FormPage} path="/:code" />

      <Route component={DownloadPage} path="/download/:token" />
    </Router>
  );
};
