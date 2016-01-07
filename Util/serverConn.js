"use strict";
import mqtt from 'mqtt';


export function serverConn(url,topic0) {
  const client= mqtt.connect(url);

  client.on('connect', function () {
    console.log('connected.');
    client.subscribe('qa/#');
  });
  return store => next => {
    console.log('initialize serverConn once');
    client.on('message', (topic, message)=>{
      console.log(message.toString());
      next(JSON.parse(message.toString()));
    });
    return action => {
      // console.log(action);
      let {type,path,local} = action;
      if(type==='data' && path && !local) {
        let topic=topic0||('qa/'+path.join('/'));
        let message=JSON.stringify(action);
        console.log(topic);
        client.publish(topic, message, {
          qos:1,retain:true
        });
      }
      next(action);
    };
  };
}