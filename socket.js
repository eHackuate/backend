const accountSid = process.env.ACCOUNTSID
const token = process.env.TOKEN

const twilio = new require('twilio')(accountSid, token)

const fromNumber = process.env.FROM
const toNumber = process.env.TO

exports.register = (server, options, next) => {
  const io = require('socket.io')(server.listener);

  io.on('connection', (socket) => {
    console.log(`${socket.id} connected!`);

    socket.on('calendar', () => {
      console.log(`${socket.id} calendar`);

      socket.emit('calendar', { from: 1200, to: 1400, name: 'Meeting with client', location: 'Building 2, Meeting room 5' })
    });

    socket.on('disconnection', () => {
      console.log(`${socket.id} disconnected`);
    });

    socket.on('incident', () => {
      console.log(`${socket.id} incident received!`)

      // Send message
      let promise = twilio.messages.create({
        from: fromNumber,
        to: toNumber,
        body: `New incident detected! Things are happening! Are you okay? (Y/N)`
      })
      promise.then((message) => {
        console.log(`Sent message: ${message.sid}`)
      })
      promise.catch((err) => {
        console.error(err)
      })

      socket.emit('sms', { value: 'SMS', people: 'Test person' })
    });
  });

  next();
};

exports.register.attributes = {
    name: 'hapi-socket'
};
