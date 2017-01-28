var Server = require('./Server');
var server = new Server();
server.start();

// Error handling (only use in debug)
process.on('uncaughtException', function (err)
{
    console.log(err);
})
