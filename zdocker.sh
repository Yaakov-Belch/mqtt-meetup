#!/bin/bash
rm -rf Build
mkdir  Build
cd     Build

GET https://nodejs.org/dist/v4.2.4/node-v4.2.4-linux-x64.tar.xz\
    >>binary-node.tar.xz
tar xf binary-node.tar.xz
mv node* Node

git clone https://github.com/Yaakov-Belch/mqtt-meetup.git App
cd App
  rm -rf .git
  npm install
  npm run build
cd ..

cat >Dockerfile <<...
from debian:8.2
maintainer Yaakov Belch <docker-image-qa-app@yaakovnet.net>

run   useradd -m node
user  node

copy Node /home/node/Node
ENV PATH  /home/node/Node/bin:$PATH
copy App  /home/node/App
workdir   /home/node/App
expose 8080
cmd ["node","start-mosca.js"]
...


docker build -t yaakovbelch/qa-app:0.1 .
