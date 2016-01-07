"use strict";
import {modify} from '../Util/modify.js';

function make_initial_state(state,actions) {
  state.data={}; let ctime=1;
  for(let action0 of actions) { let action=modify.copy(action0);
    action.type='data'; action.version=1; action.ctime=ctime++;
    state.data=modify.deeply(state.data,action.path,()=>action);
  }
  return state;
}

export const initialState = make_initial_state({}, [
  {path:['text'], md:'... the main topic ...'}
]);

export const initialState0 = make_initial_state({}, [
  {path:['text'], md:'Main topic'},
  {path:[':11','text'], md:'First Question **Title**'},
  {path:[':11',':2','text'], md:'Question text'},
  {path:[':11',':2',':4','text'], md:'comment 1-1'},
  {path:[':11',':2',':5','text'], md:'comment 1-2'},
  {path:[':11',':3','text'], md:'Answer text'},
  {path:[':11',':3',':6','text'], md:'comment 2-1'},
  {path:[':11',':3',':7','text'], md:'comment 2-2'},

  {path:[':21','text'], md:'Second Question **Title**'},
  {path:[':21',':2','text'], md:'Question text'},
  {path:[':21',':2',':4','text'], md:'comment 1-1'},
  {path:[':21',':2',':5','text'], md:'comment 1-2'},
  {path:[':21',':3','text'], md:'Answer text'},
  {path:[':21',':3',':6','text'], md:'comment 2-1'},
  {path:[':21',':3',':7','text'], md:'comment 2-2'},
]);
