const Hapi = require('hapi');
const socket = require('./socket');

const server = new Hapi.Server();
server.connection({ port: process.env.PORT || 8080 });

server.register(socket, (err) => {
  if (err) { throw err; }
  server.route({
    method: 'POST',
    path: '/sms',
    handler: require('./sms')
  })
  server.start();
});