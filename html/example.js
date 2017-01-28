/* Edit this stuff */
var ip = "ws://127.0.0.1:777";
var ws = new WebSocket(ip);

function onLoad()
{
    ws.binaryType = "arraybuffer";

    ws.onopen = open;
    ws.onclose = close;
    ws.onerror = close;
    ws.onmessage = message;

    // dont do this but im lazy
    window.msgText = document.getElementById("message");
    msgText.innerHTML = "Connecting to " + ip + "..";
}

function open()
{
    msgText.innerHTML = "Connected to " + ip + ", press any key!";

    document.addEventListener("keydown", function(k)
    {
        msgText.innerHTML = "Sending " + k.keyCode + " (" + String.fromCharCode(k.keyCode) + ")" + "..";
        sendKey(k.keyCode);
    }, false);
}

function createBuffer(size)
{
    return new DataView(new ArrayBuffer(size))
}

function sendBuffer(dataview)
{
    ws.send(dataview.buffer)
}

function sendKey(keycode)
{
    // Packet number: 69 (also up to 256)
    // Keycode size is maximum of 256 (1 byte)
    // Size of 2 for createBuffer, as we have a maximum of 2 bytes being written
    var buffer = createBuffer(2);
    var offset = 0;
    buffer.setUint8(offset++, 69);
    buffer.setUint8(offset++, keycode);
    sendBuffer(buffer);
}

function close()
{
    msgText.innerHTML = "WebSocket closed or failed to connect!";
}

function message(msg)
{
    var buffer = new DataView(msg.data);
    var offset = 0;

    // Packet id is position 1, byte
    var id = buffer.getUint8(offset++, true);
    switch(id)
    {
        case 69:
            var keycode = buffer.getUint8(offset++, true);
            var text = "Received key back from server, " + keycode + " (" + String.fromCharCode(keycode) + ")";
            alert(text);
            msgText.innerHTML = text;
            break;
    }
}
