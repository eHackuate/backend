const { receiveReply } = require('./socket.js');

module.exports = (request, reply) => {
  console.log('Received new SMS', request.payload)
  receiveReply(request.payload)
  reply({ status: 'success' })
}
