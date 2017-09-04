const accountSid = process.env.ACCOUNTSID
const token = process.env.TOKEN
const fromNumber = process.env.FROM
const toNumber = process.env.TO
const twilio = new require('twilio')(accountSid, token)

// TODO; replace redacted with actuall numbers
const people = [
  {
    id: 0,
    name: 'Erfan ilovemycoffee',
    number: 'redacted',
    role: 'Software Developer',
    status: 'okay',
    chain: []
  },
  {
    id: 1,
    name: 'Josh O\'Hackeroo',
    number: 'redacted',
    role: 'Software Developer',
    status: 'idk',
    chain: []
  },
  {
    id: 2,
    name: 'Eric McCode',
    number: 'redacted',
    role: 'Software Developer',
    status: 'idk',
    chain: []
  },
  {
    id: 3,
    name: 'Ramzi Danger',
    number: 'redacted',
    role: 'Software Developer',
    status: 'bad',
    chain: []
  },
  {
    id: 4,
    name: 'Em McBusiness',
    number: 'redacted',
    role: 'Product Manager',
    status: 'okay',
    chain: []
  }
];

exports.register = (server, options, next) => {
  const io = require('socket.io')(server.listener);

  io.on('connection', (socket) => {
    console.log(`${socket.id} connected!`);

    socket.on('disconnection', () => {
      console.log(`${socket.id} disconnected`);
    });

    // frontend has a special signal to join the room
    socket.on('imfrontend', () => {
      console.log(`${socket.id} is a front end!`);

      socket.join('frontend');
      socket.to('frontend').emit('update', people)
    })

    socket.on('incident', () => {
      console.log(`${socket.id} incident received!`)

      // Send message
      // /* <- this means don't send sms (comment the comment out to send sms... so meta)
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
      /* I use this to not send sms when doing shit */

      people.forEach((person) => person.chain.push(`New incident detected! Things are happening! Are you okay? (Y/N)`));
      socket.to('frontend').emit('update', people)
    });
  });

  next();
};

exports.register.attributes = {
    name: 'hapi-socket'
};
