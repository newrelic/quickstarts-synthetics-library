const assert = require('assert');

const tls = require('tls');

const timerstart = Date.now();

const client = tls.connect(
  {
    port: 1234,
    host: '1.2.3.4',
  },
  () => {
    console.log('connected to server!');
    client.destroy();
    const connectTime = Date.now() - timerstart;
    console.log(`Connected in: ${connectTime} ms`);
    $util.insights.set('connectTime', connectTime);
    assert.ok(
      connectTime < 2000,
      `ERROR - took longer than 2 seconds to connect. Connect time: ${connectTime}`
    );
  }
);
