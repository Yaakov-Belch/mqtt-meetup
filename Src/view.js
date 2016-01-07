"use strict";
import React from 'react';
import marked from 'marked';
import TextArea from 'react-textarea-autosize';

import { TreeNode } from '../Util/view-node.js';
import { modify }       from '../Util/modify.js';


const textarea={width:'100%'};
const borderBottom='1px solid #ddd';

const navigStyle={
  fontStyle: 'italic',
  textAlign: 'center',
  backgroundColor: '#ddf',
  borderBottom
};
const listStyle= {
  text: { borderBottom, fontSize:'large', fontWeight:'900' },
  footer: {},
  textarea
};
const linkStyle= {
  node: { borderBottom },
  textarea
};
const appStyle=[
  {
    text: { borderBottom, fontSize:'large', fontWeight:'900' },
    // text: { borderBottom },
    children:{ marginLeft: '4em' },
    footer:  { marginLeft: '4em' },
    textarea,
  },
  {
    node:{ borderBottom },
    children:{ marginLeft: '4em' },
    footer:  { marginLeft: '4em' },
    textarea,
  },
  {
    children:{ marginLeft: '4em' },
    textarea,
  }
];

function navigBar(api) { return(
  <div style={navigStyle} onClick={e=>api.setPageIdOf(undefined)}>
    Simple Questions, Simple Answers
  </div>
);}

function text_md(node,api,onClick) {
  let md=modify.read(node,['data','text','md']);
  if(md===undefined) { md=''; }
  if(modify.read(node,['data','edit','active'])) {
    return(
      <TextArea
        style={node.style.textarea}
        value={md}
        onChange=      { e=>api.editText(node,e.target.value) }
        onContextMenu= { e=>{e.preventDefault();api.setEdit(node,false);} }
      />
    );
  } else {
    return(
      <div
        onClick={onClick}
        onContextMenu={(e)=>{e.preventDefault();api.setEdit(node,true);}}
        dangerouslySetInnerHTML={{__html:marked(md)||'...'}}
        style={node.style.text}
      />
    );
  }
}

function xfooter(node,api) {
  let style=node.style.footer;
  if(style) {
    let click= e=>{e.preventDefault(); api.addChildTo(node)};
    return <div style={style} onClick={click} onContextMenu={click}>...</div>;
  } else {
    return undefined;
  }
}

function lexicoKeyFor(node) { return [
  modify.read(node,['data','text','stime'])||Infinity,
  modify.read(node,['data','text','ctime'])||Infinity
];}

class QANode extends TreeNode {
  getStyle()      { return appStyle[this.level] || modify.readLast(appStyle); }
  viewHeader(api) { return this.level? undefined: navigBar(api); }
  viewBody  (api) { return text_md(this,api); }
  viewFooter(api) { return xfooter(this, api); }
  lexicoKey()     { return lexicoKeyFor(this); }
  makeChild(key,data) { return new QANode({key,data,level:this.level+1}); }
}

class ListNode extends TreeNode {
  getStyle()      { return listStyle; }
  viewHeader(api) { return navigBar(api); }
  viewBody  (api) { return text_md(this,api); }
  viewFooter(api) { return xfooter(this, api); }
  lexicoKey()     { return lexicoKeyFor(this); }
  makeChild(key,data) { return new LinkNode({key,data}); }
}

class LinkNode extends TreeNode {
  getStyle()      { return linkStyle; }
  viewBody(api)   { return text_md(this,api,()=>api.setPageIdOf(this)); }
  lexicoKey()     { return lexicoKeyFor(this); }
  children()      { return []; }
}

export function root_node(state) {
  let {page_id}=state;
  if(page_id) {
    return new QANode({data:state.data[page_id],level:0});
  } else {
    return new ListNode({data:state.data});
  }
}