# rm -rf Db/
node_modules/.bin/mosca -v  \
  --http-port 8080          \
  --host 0.0.0.0            \
  --http-static WWW         \
  --http-bundle             \
  -d Db/

# mqtt_sub -t hello
# mqtt_pub -t hello -m message

# mqtt_sub -t hello            -l ws -h mqtt-meetup-yaakov-belch.c9users.io
# mqtt_pub -t hello -m message -l ws -h mqtt-meetup-yaakov-belch.c9users.io

# https://mqtt-meetup-yaakov-belch.c9users.io/mqtt-client.html
# https://mqtt-meetup-yaakov-belch.c9users.io/App/