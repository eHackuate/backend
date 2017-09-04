const Hapi = require('hapi');
const socket = require('./socket');
const corsHeaders = require('hapi-cors-headers');

const server = new Hapi.Server();
server.connection({ port: process.env.PORT || 8080 });
server.ext('onPreResponse', corsHeaders)

server.register(socket, (err) => {
  if (err) { throw err; }
  server.route({
    method: 'POST',
    path: '/sms',
    handler: require('./sms')
  })
  server.start();
});