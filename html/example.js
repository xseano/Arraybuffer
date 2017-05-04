var ip = "ws://127.0.0.1:8080";

function KeyObject(id, keyCode) {
  this.id = id;
  this.keyCode = keyCode;
}

function onLoad() {
    window.ws = new WebSocket(ip);

    ws.binaryType = "arraybuffer";

    ws.onopen = open;
    ws.onclose = error;
    ws.onerror = error;
    ws.onmessage = message;

    window.msgText = document.getElementById("message");
    msgText.innerHTML = "Connecting to " + ip + "...";
}

function open() {
    msgText.innerHTML = "Connected to " + ip + ", press any key!";

    document.addEventListener("keydown", function(k) {

        msgText.innerHTML = "Sending " + k.keyCode + " (" + String.fromCharCode(k.keyCode) + ")" + "..";
        sendKey(k.keyCode);

    }, false);
}

function str2ab(str) {
    var escstr = encodeURIComponent(str);
    var binstr = escstr.replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    });
    var ua = new Uint8Array(binstr.length);
    Array.prototype.forEach.call(binstr, function (ch, i) {
        ua[i] = ch.charCodeAt(0);
    });
    return ua;
}

function ab2str(ab) {
    var binstr = Array.prototype.map.call(ab, function (ch) {
        return String.fromCharCode(ch);
    }).join('');
    var escstr = binstr.replace(/(.)/g, function (m, p) {
        var code = p.charCodeAt(0).toString(16).toUpperCase();
        if (code.length < 2) {
            code = '0' + code;
        }
        return '%' + code;
    });
    return decodeURIComponent(escstr);
}

function uintIfy(obj) {
  var stringifiedObj = JSON.stringify(obj); // "{'x': '1'}"
  var abObj = this.str2ab(stringifiedObj); // Uint8Array[xyx, yzx, yxz, zyx]
  return abObj;
}

function sendKey(keyCode) {
  var keyObj = new KeyObject('key', keyCode);
  var keyArr = uintIfy(keyObj);
  ws.send(keyArr);

}

function onConn() {
  if (ws.readyState == 1) {
    onLoad();
  } else {
    onLoad();
  }
}

function error(e) {
  onClose(e, true);
}

function onClose(e, error) {
    if (e.code || e.reason) {
        console.log("Socket Closed! Reason: " + e.code + " " + e.reason);
        msgText.innerHTML = "Socket Closed! Reason: " + e.code + " " + e.reason;
        onConn();
    } else {
        console.log("Socket Error!");
    }

}

function message(msg) {
  var buffer = new DataView(msg.data);
  var newArr = [];

  for (var i = 0; i < buffer.buffer.byteLength; i++) {
    newArr.push(buffer.getUint8(i, true));
  }

  var newUint8Arr = new Uint8Array(newArr);
  var hr2Arr = ab2str(newUint8Arr);

  var parsed = JSON.parse(hr2Arr);
  var mID = parsed.id;

  if (mID == 'keyBack') {
    var text = "Received key back from server, " + parsed.keyCode + " (" + String.fromCharCode(parsed.keyCode) + ")";
    alert(text);
    msgText.innerHTML = text;
  }
}
