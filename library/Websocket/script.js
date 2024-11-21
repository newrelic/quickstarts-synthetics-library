var assert = require('assert');
var WebSocket = require('ws');

// Custom timers
const wsConnectTimer = $har.addResource("WS Connect")
const wsSendTimer = $har.addResource("WS Send");
const wsReceiveTimer = $har.addResource("WS Received");

wsConnectTimer.startTimer();
// This endpoint is a sample websocket that will echo anything sent to it.
const ws = new WebSocket('wss://echo.websocket.org');

// Throw an error if the websocket connection failed.
ws.on('error', (error) => {
  wsConnectTimer.endTimer();
  assert(!error, "Error occured: "+error);
})

// Send a message when the websocket connection opens.
ws.on('open', () => {
  wsConnectTimer.endTimer();
  wsSendTimer.startTimer();
  ws.send('testing');
  wsSendTimer.endTimer();
  wsReceiveTimer.startTimer();
})

// Log out messages that are received. Close the connection after receiving a message. 
ws.on('message', (data) => {
 console.log('received: ' + data); 
  // Did we receive our test message? 
  if (data == 'testing')
  {
    console.log('Test message received, ending timer and closing connection');
    wsReceiveTimer.endTimer();
    ws.close();
  }
  
})