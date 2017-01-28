const BinaryWriter = require('../lib/BinaryWriter');

class Key
{
    constructor(keycode)
    {
        this.keycode = keycode;
    }

    // Override
    build()
    {
        var writer = new BinaryWriter();
        writer.writeUInt8(69);
        writer.writeUInt8(this.keycode);
        return writer.toBuffer();
    }
}

module.exports = Key;
