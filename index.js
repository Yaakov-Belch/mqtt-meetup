"use strict";
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { store, MQTTApp } from './Src/app.js';

ReactDOM.render(
  <Provider store={store}>
    <MQTTApp/>
  </Provider>,
  document.getElementById('root')
);
