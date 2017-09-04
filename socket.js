const accountSid = process.env.ACCOUNTSID
const token = process.env.TOKEN
const fromNumber = process.env.FROM
const toNumber = process.env.TO
const twilio = new require('twilio')(accountSid, token)
const numbers = require('./numbers');

// global var so other function can access it
let io;

const people = [
  {
    id: 0,
    name: 'Erfan ilovemycoffee',
    avatar: 'https://avatars3.githubusercontent.com/u/9994172?v=4&s=460',
    number: numbers[0],
    role: 'Software Developer',
    lastSeen: 1504537609,
    status: 'okay',
    chain: []
  },
  {
    id: 1,
    name: 'Josh O\'Hackeroo',
    avatar: 'https://avatars1.githubusercontent.com/u/14273489?v=4&s=460',
    number: numbers[1],
    role: 'Software Developer',
    lastSeen: 1504537609,
    status: 'idk',
    chain: []
  },
  {
    id: 2,
    name: 'Eric McCode',
    avatar: 'https://avatars1.githubusercontent.com/u/14273489?v=4&s=460',
    number: numbers[2],
    role: 'Software Developer',
    lastSeen: 1504537609,
    status: 'idk',
    chain: []
  },
  {
    id: 3,
    name: 'Ramzi Danger',
    avatar: 'https://avatars1.githubusercontent.com/u/14273489?v=4&s=460',
    number: numbers[3],
    role: 'Software Developer',
    lastSeen: 1504537609,
    status: 'bad',
    chain: []
  },
  {
    id: 4,
    name: 'Em McBusiness',
    avatar: 'https://avatars1.githubusercontent.com/u/14273489?v=4&s=460',
    number: numbers[4],
    role: 'Product Manager',
    lastSeen: 1504537609,
    status: 'okay',
    chain: []
  }
];

exports.receiveReply = (payload) => {
  people.forEach((person) => {
    if (person.number === payload.From) {
      person.chain.push({
        type: 'from',
        payload.Body
      })
    }
  });
  io.in('frontend').emit('update', people);
  console.log(JSON.stringify(people))
};

exports.register = (server, options, next) => {
  io = require('socket.io')(server.listener);

  io.on('connection', (socket) => {
    console.log(`${socket.id} connected!`);

    socket.on('disconnection', () => {
      console.log(`${socket.id} disconnected`);
    });

    // frontend has a special signal to join the room
    socket.on('imfrontend', () => {
      console.log(`${socket.id} is a front end!`);

      socket.join('frontend');
      io.in(socket.id).emit('update', people)
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

      people.forEach((person) => person.chain.push({
        type: 'to',
        text: 'New incident detected! Things are happening! Are you okay? (Y/N)'
      }));
      socket.to('frontend').emit('update', people)
    });
  });

  next();
};

exports.register.attributes = {
    name: 'hapi-socket'
};
