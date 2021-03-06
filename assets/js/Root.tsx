import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Header from './components/Header';
import HomePage from './pages';
import CounterPage from './pages/counter';
import FetchDataPage from './pages/fetch-data';
import DisplayMessagePage from './pages/DisplayMessagePage';

const Root: React.FC = () => (
  <>
    <Header />
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/counter" component={CounterPage} />
        <Route path="/messages" component={DisplayMessagePage} />
        <Route path="/fetch-data" component={FetchDataPage} />
      </Switch>
    </BrowserRouter>
  </>
);

export default Root;
