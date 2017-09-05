const process = require('process');
const Hapi = require('hapi');
const socket = require('./socket');
const corsHeaders = require('hapi-cors-headers');

const server = new Hapi.Server();
server.connection({ port: process.env.PORT || 8080 });
server.ext('onPreResponse', corsHeaders);

server.on('response', (request) => {
  console.log(`Payload: ${JSON.stringify(request.payload, null, 2)}`);
  console.log(`${request.info.remoteAddress}: ${request.method.toUpperCase()} ${request.url.path} --> ${request.response.statusCode}`);
});

server.register(socket, (err) => {
  if (err) { throw err; }
  server.route({
    method: 'POST',
    path: '/sms',
    handler: require('./sms')
  });
  server.start();
});
