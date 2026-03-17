module.exports = function SocketWrapper(
    socket,
    onConnectCallback,
    onDisconnectCallback,
) {
    var handlers = {};
    var connected = false;

    socket.binaryType = "arraybuffer";

    this.on = function (event, handler) {
        handlers[event] = handler;
    };

    this.send = function (event, data) {
        socket.send(JSON.stringify([event, data]));
    };

    this.sendBinary = function (messageType, data) {
        var packet = new Uint8Array(1 + data.byteLength);
        packet[0] = messageType;
        var dataBytes = new Uint8Array(data);
        packet.set(dataBytes, 1);
        socket.send(packet.buffer);
    };

    this.onDisconnect = function (callback) {
        socket.onclose = callback;
    };

    socket.onmessage = function (event) {
        if (!("data" in event)) return;

        var data = event.data;

        if (data instanceof ArrayBuffer) {
            var messageType = new Uint8Array(data)[0];
            var payload = data.slice(1, data.byteLength);
            if (messageType in handlers) handlers[messageType](payload);
        } else {
            try {
                var parsed = JSON.parse(data);
                if (parsed.length != 2) return;
                var eventName = parsed[0];
                if (eventName in handlers) handlers[eventName](parsed[1]);
            } catch (err) {
                console.log(err);
            }
        }
    };

    socket.onopen = function () {
        if (!connected) {
            connected = true;
            if (onConnectCallback !== undefined) onConnectCallback();
        }
    };

    if (onDisconnectCallback !== undefined)
        socket.onclose = onDisconnectCallback;

    if (socket.readyState == 1) {
        connected = true;
        if (onConnectCallback !== undefined) onConnectCallback();
    }
};
