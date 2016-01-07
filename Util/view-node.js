"use strict";
import React from 'react';
import { lexicoSort }   from '../Util/lexicoSort.js';


export class ViewNode extends React.Component {
  render() {
    const {node, api} = this.props;
    return (
      <div style={node.style.node}>
        {node.viewHeader(api)}
        {node.viewBody(api)}
        <div style={node.style.children}>
          {node.children().map(child=><ViewNode key={child.key} node={child} api={api}/>)}
        </div>
        {node.viewFooter(api)}
      </div>
    );
  }
}

function isId(id) { return id.substring(0,1)===':' }

export class TreeNode {
  constructor(info) {
    Object.assign(this, info);
    this.style=this.getStyle();
  }
  children() {
    return lexicoSort(
      Object.keys(this.data).filter(key=>isId(key))
            .map(key=>this.makeChild(key,this.data[key]))
    );
  }
  getStyle()      { return {}; }
  viewHeader(api) { return undefined; }
  viewBody  (api) { return undefined; }
  viewFooter(api) { return undefined; }
}
