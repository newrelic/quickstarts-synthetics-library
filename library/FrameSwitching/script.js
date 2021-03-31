// This uses the ID of the frame element to switch. Replace <frameid> with with appropriate element ID. Feel free to use XPath, CSS, or other element identifiers instead.
// Waiting until ableToSwitchToFrame waits up until the specified timeout (20s here) and switches to the frame as soon as it is found.
previousAction.then(function () {
  return $browser.wait(
    $driver.until.ableToSwitchToFrame(By.id('<frameid>')),
    20000
  );
});
