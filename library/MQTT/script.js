/**
 * This requires the use of a private location and support for custom Node modules from Job Manager (https://docs.newrelic.com/docs/synthetics/synthetic-monitoring/private-locations/job-manager-configuration/#custom-modules) so that the mqtt module will be available.
*/

const mqtt = require("mqtt");
const assert = require("assert");

// Custom timers
const MQTTConnectTimer = $har.addResource("MQTT Connect")
const MQTTSubscribeTimer = $har.addResource("MQTT Subscribe");
const MQTTPublishTimer = $har.addResource("MQTT Publish");

MQTTConnectTimer.startTimer();

// Use secure credentials to manage usernames and passwords.
const client = mqtt.connect({
  host: 'REPLACEME',
  port: 1884,
  username: "REPLACEME",
  password: "REPLACEME", 
  connectTimeout: 30000
});

client.on("error", (error) => {
  MQTTConnectTimer.endTimer();
  throw new Error("Unable to connect to MQTT server! "+error);
})

// Subscribe to the synthetics topic when connected
client.on("connect", () => {
  MQTTConnectTimer.endTimer();
  
  MQTTSubscribeTimer.startTimer();
  client.subscribe("synthetics", (err) => {
    MQTTSubscribeTimer.endTimer();
    assert(!err, "Error subscribing to test topic: "+ err)
    MQTTPublishTimer.startTimer();
    client.publish("synthetics", "Hello synthetics");
  });
});

// Log out messages received
client.on("message", (topic, message) => {
  MQTTPublishTimer.endTimer();
  // message is Buffer
  console.log(message.toString());
  client.end();
});