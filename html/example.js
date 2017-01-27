/* Edit this stuff */
var ip = "ws://127.0.0.1:777";

function onLoad()
{
    var ws = new WebSocket(ip);
    ws.binaryType = "arraybuffer";

    ws.onopen = open;
    ws.onclose = close;
    ws.onerror = close;
    ws.onmessage = message;

    document.addEventListener("keydown", function(k)
    {
        msgText.innerHTML = "Sending " + k.keyCode + "..";
    }, false);

    // dont do this but im lazy
    window.msgText = document.getElementById("message");
    msgText.innerHTML = "Connecting to " + ip + "..";
}

function open()
{
    msgText.innerHTML = "Connected to " + ip + ", press any key!";
}

function close()
{
    msgText.innerHTML = "WebSocket closed or failed to connect!";
}

function message()
{

}
