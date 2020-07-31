import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './sections/Home';
import { ThemeProvider } from './style';

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Switch>
          <Route exact component={Home} path="/:code?" />
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

export default App;
