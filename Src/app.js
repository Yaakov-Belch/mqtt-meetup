"use strict";
import { createStore, applyMiddleware } from 'redux'
import {connect} from 'react-redux';

import { serverConn } from '../Util/serverConn.js';
import { appReducer } from './model.js';

export const store=applyMiddleware(serverConn('ws://',null,'qa-proc'))(createStore)(appReducer);


import { ViewNode  } from '../Util/view-node.js';
import { root_node } from './view.js';
import { make_api  } from './model.js';

// Connected Component
export const MQTTApp = connect(
  (state)   => { return { node: root_node(state) } },
  (dispatch)=> { return { api: make_api(dispatch)} }
)(ViewNode);
