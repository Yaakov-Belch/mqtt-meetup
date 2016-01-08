"use strict";

const mosca = require('mosca');
const mqtt  = require('mqtt');

const opts={
  backend: {},
  logger: {},
  stats: false,
  persistence: { factory: mosca.persistence.Memory },
  interfaces: [
    {
      type: 'http',
      host: process.env.IP||'0.0.0.0',
      port: (process.env.PORT||8080)*1,
      'static': 'WWW',
      bundle: true
    }, {
      type: 'mqtt',
      host: process.env.IP,
      port: 1883
    }
  ]
};

new mosca.Server(opts, (err)=>{
  console.log(err||'The server started.')
  if(!err) {
    const client = mqtt.connect('mqtt://'+process.env.IP+':1883/');

    client.on('connect', function () {
      console.log('qa-proc ready.');
      client.subscribe('qa-proc');
    });

    client.on('message', function (topic, message) {
      let action=JSON.parse(message.toString()); // message is Buffer
      if(action.type==='data' && action.path) {

        // Normalize topic creation time to server-time (when client-time was set).
        if(action.ctime) { delete action.ctime; action.stime=1*new Date; }

        let topic='qa/'+action.path.join('/');
        let message=JSON.stringify(action);
        client.publish(topic, message, {
          qos:1,retain:true
        });
      }
    });
  }
});
