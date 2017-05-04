const BinaryReader = require('./lib/BinaryReader');
const BinaryWriter = require('./lib/BinaryWriter');
const KeyObject = require('./constructors/KeyObject');

class Client {

    constructor(id, ws) {
        this.id = id;
        this.socket = ws;
        this.writer = new BinaryWriter();
    }

    uintIfy(obj) {
    	var stringifiedObj = JSON.stringify(obj);
    	var abObj = this.writer.writeArray(stringifiedObj);
      var objUArr = new Uint8Array(abObj);
    	return objUArr;
    }

    onMessage(msg) {
      this.reader = new BinaryReader(msg);
      var objUArr = new Uint8Array(msg);
      var objStr = this.reader.readArray(objUArr);
      var parsed = JSON.parse(objStr);
      var mID = parsed.id;

      if (mID == "key") { // key packet where {'id' =: 'key'}
        var keyCode = parsed.keyCode;
        var keyObj = new KeyObject('keyBack', keyCode);
        var keyArr = this.uintIfy(keyObj);
        this.socket.send(keyArr);
      }
    }
}

module.exports = Client;
