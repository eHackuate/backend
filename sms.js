module.exports = (request, reply) => {
    console.log('Received new SMS')
    console.log(request)
    reply('yay!')
  }
