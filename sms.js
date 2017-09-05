const { receiveReply } = require('./socket.js');

module.exports = (request, reply) => {
  console.log('Received new SMS', JSON.stringify(request.payload, null, 2));
  receiveReply(request.payload);
  reply({ status: 'success' });
};
