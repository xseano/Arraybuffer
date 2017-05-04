const WebSocket = require('ws');
const cowsay = require('cowsay');
const Client = require('./Client');

class Server {
    constructor() {

        // Change these
        this.message = "Buffffffffferrrrrrrss";
        this.id = 1;
    }

    start() {
        console.log(cowsay.say({text: this.message, e: "oO", T: "U "}));

        const wss = new WebSocket.Server({perMessageDeflate: false, port: 8080}, this.onStart.bind(this));
        wss.on('connection', this.onConnection.bind(this));
    }

    onStart() {
        console.log("WebSocket Server up and running on port " + 8080 + "!");
    }

    onConnection(ws) {
        var client = new Client(this.getNextID(), ws);
        client.ip = ws.upgradeReq.connection.remoteAddress;
        client.socket.on('message', client.onMessage.bind(client));

        console.log("Client with IP " + client.ip + " and ID " + client.id + " connected!");
    }

    getNextID() {
        return this.id++;
    }
}

module.exports = Server;
