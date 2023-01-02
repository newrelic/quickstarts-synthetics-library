var otpauth = require('otpauth');

// The secret is the value obtained while setting up 2FA/MFA for your user and choosing the Can't scan the QR code option.
// Capture this key and store it in a Secure Credential for use during monitor execution.
var secret = $secure.TESTOKTAMFA;

// This encoding and algorithm combination is used for Google Authenticator or Okta based TOTP.
let totp = new otpauth.TOTP({
  algorithm: 'SHA1',
  digits: 6,
  period: 30,
  secret: secret
})

// The scripted browser logic to navigate to the MFA screen would be located here. Find the object and then use this as the input to sendKeys.
// Since this is time based, send the output to sendKeys directly instead of storing this in a variable at the top of your script.
// Example: el.sendKeys(totp.generate()) where el is the element.
// This quickstart logs out the token instead of sending it to an element or as input to an API test.
let token = totp.generate();
console.log(token);