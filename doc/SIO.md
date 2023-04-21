### Connect and get BTC price info by tick

Connect to web socket with url `http://localhost:8008/btc-ticker`
send `start-btc-ticker` event and listen `btc-tick`
send `stop-btc-ticker` event for stop ticking

> You can run server and open simple HTML doc example from `./frontend/index.html`

use JS for client side (just for example, you can using any client)

```js
const { io } = require("socket.io-client");
const socket = io();
// DEV port 8008, 
// PROD port 80
const socket = io("http://localhost:8008/btc-ticker");

socket.on("connect", () => {
  // checking
  console.log(socket.id); // x8WIv7-mJelg7on_ALbx

  const engine = socket.io.engine;
  console.log(engine.transport.name); // in most cases, prints "polling"

  engine.once("upgrade", () => {
    // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
    console.log(engine.transport.name); // in most cases, prints "websocket"
  });

  socket.emit("start-btc-ticker");
});
socket.on("btc-tick", ({ type, data }) => {
  console.log(data)
});
```


