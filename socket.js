const process = require('process');
const ACCOUNTSID = process.env.ACCOUNTSID;
const TOKEN = process.env.TOKEN;
const FROM_NUMBER = process.env.FROM;
const twilio = new require('twilio')(ACCOUNTSID, TOKEN);
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
    status: 'idk',
    chain: []
  },
  {
    id: 1,
    name: 'Josh O\'Hackeroo',
    avatar: 'https://avatars2.githubusercontent.com/u/712727?v=4&s=460',
    number: numbers[1],
    role: 'Software Developer',
    lastSeen: 1504537609,
    status: 'idk',
    chain: []
  },
  {
    id: 2,
    name: 'Eric McCode',
    avatar: 'https://avatars3.githubusercontent.com/u/5687681?v=4&s=460',
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
    status: 'idk',
    chain: []
  },
  {
    id: 4,
    name: 'Em McBusiness',
    avatar: 'https://avatars1.githubusercontent.com/u/14273489?v=4&s=460',
    number: numbers[4],
    role: 'Product Manager',
    lastSeen: 1504537609,
    status: 'idk',
    chain: []
  },
  {
    id: 5,
    name: 'Guest User #1',
    avatar: '',
    number: numbers[5],
    role: 'Guest',
    lastSeen: 1504532649,
    status: 'okay',
    chain: []
  }
];

exports.receiveReply = (payload) => {
  people.forEach((person) => {
    if (person.number === payload.From) {
      person.chain.push({
        type: 'from',
        text: payload.Body
      });

      if ((/\b(yeh|yeah|yes|ya|yep)\b/).test(payload.Body.toLowerCase())) {
        person.status = 'okay';
      } else if ((/\b(no|nope|nah|neg)\b/).test(payload.Body.toLowerCase())) {
        person.status = 'bad';
      }
    }
  });
  io.in('frontend').emit('update', people);
  console.log(JSON.stringify(people, null, 2));
};

const sendSMS = (id, number, text) => {
  if (number === '+61000000000') {
    // return a bogus promise
    return new Promise((res, rej) => rej()).catch(() => {});
  }
  console.log(`${id} send text to ${number} saying "${text}"`);
  return twilio.messages.create({
    from: FROM_NUMBER,
    to: number,
    body: text
  })
    .then((message) => {
      console.log(`Sent message: ${message.sid}`);
    })
    .catch((err) => {
      console.error(err);
    });
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
      io.in(socket.id).emit('update', people);
    });

    socket.on('incident', (text) => {
      console.log(`${socket.id} incident received!`);


      people.forEach((person) => {
        const { number } = person;
        // Send message
        // /* <- this means don't send sms (comment the comment out to send sms... so meta)
        sendSMS(socket.id, number, text)
          .then(() => {
            person.chain.push({
              type: 'to',
              text
            });
          });
        /* I use this to not send sms when doing shit */
      });

      io.in('frontend').emit('update', people);
    });

    socket.on('reply', (number, text) => {
      // Send message
      // /* <- this means don't send sms (comment the comment out to send sms... so meta)
      sendSMS(socket.id, number, text)
        .then(() => {
          // update chain on frontend
          people.forEach((person) => {
            if (person.number === number) {
              person.chain.push({
                type: 'to',
                text
              });
              io.in('frontend').emit('update', people);
            }
          });
        });
      /* I use this to not send sms when doing shit */
    });
  });

  next();
};

exports.register.attributes = {
  name: 'hapi-socket'
};
