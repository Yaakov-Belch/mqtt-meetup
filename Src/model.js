"use strict";
import shortid          from 'shortid';
import { initialState } from './sample-state.js';
import { modify }       from '../Util/modify.js';

function newId() { return ':'+shortid.generate(); }

export function appReducer(state=initialState,action) {
  if(action.type==='error') { console.log(action); }
  if(action.type==='data') {
    const path=modify.unshift('data',action.path);
    if((modify.read(state,modify.push(path,'version'))||0)<(action.version||0)) {
      return modify.deeply(state,path,()=>action);
    }
    return state; // ignore out-dated action message
  }
  if(action.type==='setPageId') {
    return modify.once(state,'page_id',action.page_id);
  }
  console.log(action);
  return state;
}

function editAction(node,key,info) {
  let {path,version,stime,ctime}=node.data[key]||{};
  if(!path) {
    path=(node.data.text||{}).path;
    if(!path) {return {type:'error', from:'editAction', node, key, info }; }
    path=modify.push(modify.pop(path),key);
  }
  version=1+Math.floor(version||0);
  return Object.assign({type:'data',path,version,stime,ctime},info);
}

function addChildActions(node) {
  let {path}=node.data.text||{};
  if(!path) {return {type:'error', from:'addChildActions', node }; }
  path=modify.push(modify.pop(path),newId());
  let type='data'; let version=1; let ctime=1*new Date();
  return [
    {type, path:modify.push(path,'text'), ctime, version, md:''},
    {type, path:modify.push(path,'edit'), ctime, version, active:true, local:true},
  ];
}

function setPageIdOfAction(node) {
  return {type:'setPageId', page_id:modify.read(node,['data','text','path',0])}
}

export function make_api(dispatch) {
  return {
    editText: (node,md)=>dispatch(editAction(node,'text',{md})),
    setEdit:  (node,active)=>dispatch(editAction(node,'edit',{active, local:true})),
    setPageIdOf: (node)=>dispatch(setPageIdOfAction(node)),
    addChildTo: (node)=>{
      for(const action of addChildActions(node)) {
        dispatch(action);
      }
    }
  };
}