const BinaryReader = require('./lib/BinaryReader');
const Packet = require('./packet')

class Client
{
    constructor(id, ws)
    {
        this.id = id;
        this.socket = ws;
    }

    onMessage(msg)
    {
        var reader = new BinaryReader(msg);

        // Get the first byte (packet id)
        var id = reader.readUInt8();

        switch(id)
        {
            case 69:
                // Next byte in packet which will be keycode
                var keycode = reader.readUInt8();
                console.log('Received key, ' + String.fromCharCode(keycode) + ", sending back..");
                this.sendPacket(new Packet.Key(keycode));
                break;
            default:
                console.log("Unknown packet id: " + id + "!");
                break;
        }
    }

    sendPacket(packet)
    {
        this.socket.send(packet.build());
    }
}

module.exports = Client;
