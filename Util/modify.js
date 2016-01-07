"use strict";
export function isEmptyObj(obj) {
  for(let key in obj) { return false; }
  return true;
}

function make_modify(inplace) {
  const modify={
    inplace, make_modify,
    copy: (obj) => Object.assign({}, obj),
    once: (obj, key, val)=>{
      if(val !== undefined) {
        if(obj[key]===val) { return obj; }
        if(!inplace) { obj=modify.copy(obj); }
        obj[key]=val;
        return obj;
      } else { // delete key from obj
        if(key in obj) {
          if(!inplace) { obj=modify.copy(obj); }
          delete obj[key];
        }
        if(isEmptyObj(obj)) { return undefined; }
        return obj;
      }
    },
    deeply: (obj={}, path, fn, i=0)=>{
      if(i>=path.length) { return fn(obj); }
      let key=path[i];
      return modify.once(obj,key,modify.deeply(obj[key],path,fn,i+1));
    },
    read: (obj, path, i=0) => {
      if(i>=path.length) { return obj; }
      return modify.read((obj||{})[path[i]],path,i+1);
    },
    push:    (list,value) => [...list,value],
    pop:     (list)       => list.slice(0,-1),
    shift:   (list)       => list.slice(1),
    unshift: (value,list) => [value,...list],
    readLast:(list)       => list[list.length-1]
  };
  return modify;
}

export const modify=make_modify(false);
