"use strict";

function cmp0(a,b) {
  if(a<b) { return -1; }
  if(b<a) { return  1; }
  return 0;
}

function dateCmp(b) { return cmp0(this,b); }
function lexicoObj(obj) {
  let res=obj.compare; if(res) { return res; }
  if(obj instanceof Date) { return dateCmp; }
  if(typeof obj.lexicoKey === 'function') { return obj.lexicoKey(); }
  res=[];
  for(let key of Object.keys(obj).sort()) { res.push(key, obj[key]); }
  return res;
}

export function lexicoComp(a,b) {
  if(a===b) { return 0; }
  if(a===undefined) { return -1; }
  if(b===undefined) { return  1; }
  if(a===null) { return -1; }
  if(b===null) { return  1; }
  let ta=Array.isArray(a)? 'array' : typeof a;
  let tb=Array.isArray(b)? 'array' : typeof b;
  if(ta!==tb) { return cmp0(ta,tb); }
  if(ta==='array') {
    let mx=Math.min(a.length,b.length);
    for(let i=0; i<mx; i++) {
      let res=lexicoComp(a[i],b[i]);
      if(res!==0) { return res; }
    }
    return cmp0(a.length,b.length);
  }
  if(ta==='object') {
    let ca=lexicoObj(a);
    let cb=lexicoObj(b);
    if(ca===cb && typeof ca==='function') { return ca.call(a,b); }
    return lexicoComp(ca,cb);
  }
  if(ta==='number') {
    if(isNaN(a)) { return isNaN(b)? 0:1; }
    if(isNaN(b)) { return -1; }
  }
  return cmp0(a,b);
}
export function lexicoSort(list,mapFn) {
  if(mapFn) {
    return list.map(x=>[x,mapFn(x)]).sort((a,b)=>lexicoComp(a[1],b[1])).map(x=>x[0]);
  } else {
    return [...list].sort(lexicoComp);
  }
}