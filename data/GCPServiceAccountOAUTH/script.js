// This example shows how to generate a JWT, obtain a Bearer token, and interact with GCP APIs.
// This uses a service account and the authentication mechanism described here: https://developers.google.com/identity/protocols/oauth2/service-account#httprest

const crypto = require('crypto');
const assert = require('assert');

// Build the JWT

// Replace with the email address associated with the service account you created in the GCP console.
const email =  'demoserviceaccount@myprojectid.iam.gserviceaccount.com';

// Base64 encode the private key for your service account so that it can be stored in a secure credential.
// This will retrieve the encoded private key and decode it for use in the script.
const buff = new Buffer.from($secure.GCP_SERVICEACCOUNT_KEY, 'base64');
const key = buff.toString("utf-8");

// Replace with the scope necessary to interact with the GCP API you are using
const scope = "https://www.googleapis.com/auth/appengine.admin";

// Replace this with your GCP project ID
const projectId = 'MyProjectId';

const currTime = new Date().getTime() / 1000;
// Since we will be creating new jwt requests during each execution, we don't need this for more than 5 minutes
const expTime = currTime + 5 * 60;

const jwtheader = {"alg":"RS256","typ":"JWT"};
const jwtclaimset = {
    "iss": email,
    "scope": scope,
    "aud": "https://oauth2.googleapis.com/token",
    "exp": Math.floor(expTime),
    "iat": Math.floor(currTime)
}

const encodedJwtHeader = new Buffer.from(JSON.stringify(jwtheader), "utf-8").toString('base64');
const encodedJwtClaimset = new Buffer.from(JSON.stringify(jwtclaimset), "utf-8").toString('base64');
var unsignedJwt = encodedJwtHeader + '.' + encodedJwtClaimset;

const encodedSignature = crypto.createSign('RSA-SHA256').update(unsignedJwt).sign(key, 'base64')

const jwt = encodedJwtHeader + '.' + encodedJwtClaimset + '.' + encodedSignature;

getToken(jwt);

// Request a Bearer token using the JWT
function getToken(jwt) {
    $http.post('https://oauth2.googleapis.com/token',
    {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: jwt
        }
    }, function (err, response, body) {
        assert.ok(!err, "Error retrieving token" + err);
        assert.ok(response.statusCode == 200, "Error response code while retrieving token " + response.statusCode);
        var jsonBody = JSON.parse(body);
        var token = jsonBody.access_token
        getAppDetails(token);
    }
    )}

// Call GCP API with token
// Replace the placeholder with your GCP project ID OR
// Replace with a function that calls the GCP API appropriate for your use case
function getAppDetails(token) {
    $http.get(
        'https://appengine.googleapis.com/v1/apps/'+projectId,
        {
            headers: {
                Authorization: 'Bearer ' + token
            }
        },
        function (err, response, body) {
            assert.ok(!err, 'Error received on app get' + err);
            assert.ok(response.statusCode == 200, 'Negative HTTP response code on app get: ' + response.statusCode);
            // Additional validation of the response is likely needed here in a real world scenario.
            console.log(body);
        }
    )
} 