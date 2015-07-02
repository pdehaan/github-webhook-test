var fs = require('fs')

var Hapi = require('hapi')
var ngrok = require('ngrok')

const PORT = process.env.PORT || 8080

var server = new Hapi.Server()
server.connection({
  port: PORT
})

server.route({
  method: 'GET',
  path: '/',
  handler: function (req, reply) {
    reply('Hello, world!')
  }
})

server.route({
  method: 'POST',
  path: '/webhook',
  handler: function (req, reply) {
    var str = JSON.stringify(req.payload, null, 2)
    fs.writeFileSync('./logs/' + Date.now() + '.json', str)
    reply(str)
  }
})

ngrok.connect(PORT, function (err, url) {
  if (err) {
    console.error(err)
    return
  }
  server.start(function (err) {
  if (err) {
    console.error(err)
    return
  }
  console.log('Server running at:', server.info.uri)
})
});
