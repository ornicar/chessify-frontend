// React Required
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import ThemeProvider from './providers/ThemeProvider';
import store from './store/index';

// Create Import File
import './index.scss';

// Home layout
import App from './App';

import { BrowserRouter, Switch, Route } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';

import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: 'http://ca4ff549fe4b4e1dba0560d7bd5e3366@150.136.210.93:9000/6',
});

class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter basename={'/'}>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    );
  }
}

ReactDOM.render(<Root />, document.getElementById('root'));
serviceWorker.register();
