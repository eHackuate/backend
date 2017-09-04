exports.register = (server, options, next) => {
  const io = require('socket.io')(server.listener);

  io.on('connection', (socket) => {
    console.log(`${socket.id} connected!`);

    socket.on('calendar', () => {
      console.log(`${socket.id} calendar`, payload);

      socket.emit('calendar', { from: 1200, to: 1400, name: 'Meeting with client', location: 'Building 2, Meeting room 5' })
    });

    socket.on('disconnection', () => {
      console.log(`${socket.id} disconnected`);
    });
  });

  next();
};

exports.register.attributes = {
    name: 'hapi-socket'
};
