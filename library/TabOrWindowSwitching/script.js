// The action that triggered the new tab would appear above this point
previousAction
  .then(function () {
    console.log('Sleep 1 second to allow the new window/tab to open.');
    return $browser.sleep(1000);
  })
  // switch to next window Step 11
  .then(function () {
    return $browser.getAllWindowHandles();
  })
  .then(function (handles) {
    return $browser.switchTo().window(handles[1]);
  });
