var assert = require('assert');

// Get OAUTH (bearer) token
getToken(); 

// Authenticate to the tenant using a client ID and secret to capture an authorization token.
// This scope grants access to Azure Key Vault APIs if permissions have been granted to our client / application ID.
// Other scopes, such as https://manage.office.com/.default for access to O365 APIs or https://graph.microsoft.com/.default for Microsoft Graph could be used
// to access resources other than Key Vault.

function getToken() {
  $http.post('https://login.microsoftonline.com/'+$secure.AZURE_TENANT+'/oauth2/v2.0/token',
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      form: {
        'client_id': $secure.AZURE_CLIENT_ID,
        'client_secret': $secure.AZURE_CLIENT_SECRET,
        'grant_type': 'client_credentials',
        'scope': 'https://vault.azure.net/.default'
      }
    }, 
    function(err, resp, body) {
      assert.ok(!err, "Connection error during oauth " + err)
      assert.ok(resp.statusCode == 200, "Error response code received during oauth " + resp.statusCode);
      const respJson = JSON.parse(resp.body);
      var token = respJson['access_token'];
      getSecret(token);
    })
}

// This is my sample secret. The domain, secret name (SampleSecret), and version string should be updated if you are attempting to retrieve a secret value from Key Vault. 
function getSecret(token) {
  $http.get('https://test-bpeck.vault.azure.net/secrets/SampleSecret/9870ddd28a3a428a85bda4261bf66c31?api-version=7.1',
    {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    },
    function(err, resp, body) {
      assert.ok(!err, "Connection error retrieving secret " +err);
      assert.ok(resp.statusCode == 200, "Error response code received during oauth " +resp.statusCode);
      const respJson = JSON.parse(resp.body);
      console.log("Secret value: "+ respJson['value']);
    })
}