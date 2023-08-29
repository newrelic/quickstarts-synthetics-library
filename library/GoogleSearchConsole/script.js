// This example shows how to query the Google Search Console API.
// It uses a service account and the authentication mechanism described here: https://developers.google.com/identity/protocols/oauth2/service-account#httprest

const crypto = require('crypto');
const assert = require('assert');
const got = require('got');

const CHUNK_SIZE = 100;
const MAX_RETRIES = 3;

const region = 'US';  // 'US' | 'EU'
if (region === 'US') {
  var metricApiEndpoint = 'https://metric-api.newrelic.com/metric/v1';
} else if (region === 'EU') {
  var metricApiEndpoint = 'https://metric-api.eu.newrelic.com/metric/v1';
} else { // default to US
  var metricApiEndpoint = 'https://metric-api.newrelic.com/metric/v1';
}

// Authorization
const auth = {
  // Replace with the email address associated with the service account you created in the GCP console.
  email: 'demoserviceaccount@myprojectid.iam.gserviceaccount.com',
  // The scope necessary to interact with the Google Search Console API.
  scope: 'https://www.googleapis.com/auth/webmasters.readonly',
  // Base64 encode the private key for your service account so that it can be stored in a secure credential.
  // This will retrieve the encoded private key and decode it for use in the script.
  // For example: echo -n 'private-key-text' | openssl base64
  // Don't trust your private key to an online tool!
  key: $secure.GCP_SERVICEACCOUNT_KEY
}

// Query configuration
const config = {
  // 'code': 'FR',
  // 'name': 'France',
  // The URL of the property as defined in Search Console. Examples: http://www.example.com/ (for a URL-prefix property) or sc-domain:example.com (for a Domain property)
  // https://developers.google.com/webmaster-tools/v1/searchanalytics/query#parameters
  'url': 'sc-domain:example.com'
};

// Set dates
const dateToday = new Date();
const dateThreeDaysAgo = new Date(Date.now() - 3*24*60*60*1000);
const dateEnd = dateToday.toISOString().split('T')[0];
const dateStart = dateThreeDaysAgo.toISOString().split('T')[0];

// Search Analytics: query parameters (https://developers.google.com/webmaster-tools/v1/searchanalytics/query#parameters)
const data =  ({
  startDate: dateStart,  // since three days ago
  endDate: dateEnd,  // until today
  dimensions: ['page'],  // optional dimensions: country, device, page, query, searchAppearance
  type: 'web',
  rowLimit: 100,  // [Optional; Valid range is 1–25,000; Default is 1,000] The maximum number of rows to return. To page through results, use the startRow offset.
  // dimensionFilterGroups: [{  // Optional dimensional filter groups, e.g.
  //   'filters': [{  // Filter for only the beginners page
  //     'dimension': 'page',
  //     'operator': 'includingRegex',
  //     'expression': 'beginners.html$'
  //   },{  // Filter for when the query contains the term disc golf
  //     'dimension': 'query',
  //     'operator': 'contains',
  //     'expression': 'disc golf'
  //   }]
  // }]
});


/**
 * Build a JSON Web Token (JWT).
 * @returns a JWT.
 */
async function getJwt() {
  const currTime = new Date().getTime() / 1000;

  // Since we will be creating new jwt requests during each execution, we don't need this for more than 5 minutes
  const expTime = currTime + 5 * 60;

  const jwtHeader = {"alg":"RS256","typ":"JWT"};
  const jwtClaimset = {
      iss: auth.email,
      scope: auth.scope,
      aud: "https://oauth2.googleapis.com/token",
      exp: Math.floor(expTime),
      iat: Math.floor(currTime)
  }
  const encodedJwtHeader = new Buffer.from(JSON.stringify(jwtHeader), "utf-8").toString('base64');
  const encodedJwtClaimset = new Buffer.from(JSON.stringify(jwtClaimset), "utf-8").toString('base64');
  const unsignedJwt = encodedJwtHeader + '.' + encodedJwtClaimset;
  const buff = new Buffer.from(auth.key, 'base64');
  const key = buff.toString("utf-8");
  const encodedSignature = crypto.createSign('RSA-SHA256').update(unsignedJwt).sign(key, 'base64')
  const jwt = encodedJwtHeader + '.' + encodedJwtClaimset + '.' + encodedSignature;

  return jwt;
}


/**
 * Request a bearer token using the supplied JWT
 * @param {*} jwt a json web token.
 * @returns a bearer token.
 */
async function getToken(jwt) {
  const options = {
     headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    form: {
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    }
  }
  try {
    const response = await got.post('https://oauth2.googleapis.com/token', options);
    assert.ok(response.statusCode == 200, "Error response code while retrieving token " + response.statusCode);
    const jsonBody = JSON.parse(response.body);
    const token = jsonBody.access_token;
    return token;
  } catch (error) {
    assert.ok(!error, "Error retrieving token:", error);
  }
}


/**
 * Query Google Search Console API.
 * @param {*} token a valid auth token.
 */
async function querySearchConsole(token) {
  var options = {
    url: 'https://www.googleapis.com/webmasters/v3/sites/'+encodeURIComponent(config.url)+'/searchAnalytics/query',
    json: data,
    headers: {
      'Authorization': 'Bearer ' + token
    }
  };
  try {
    const response = await got.post(options);
    assert.equal(response.statusCode, 200, 'HTTP status is not 200');
    // $util.insights.set('marketCode', config.code);
    // $util.insights.set('marketName', config.name);
    $util.insights.set('marketUrl', config.url);
    console.log('response.body:', response.body)

    let metrics = new Array();
    const currentTimestamp = new Date().getTime();  // The current time in milliseconds 
    var rows = JSON.parse(response.body).rows;
    for (const row of rows) {
      console.info(row);
      metrics.push({
        "name": "google.search.console.clicks",  // clicks
        "type": "gauge",
        "value": row.clicks,
        "timestamp": currentTimestamp,
        "attributes": {
          "config.url": config.url,
          "page": row.keys[0]
        }
      });
      metrics.push({
        "name": "google.search.console.ctr",  // ctr
        "type": "gauge",
        "value": row.ctr,
        "timestamp": currentTimestamp,
        "attributes": {
          "config.url": config.url,
          "page": row.keys[0]
        }
      });
      metrics.push({
        "name": "google.search.console.impressions",  // impressions
        "type": "gauge",
        "value": row.impressions,
        "timestamp": currentTimestamp,
        "attributes": {
          "config.url": config.url,
          "page": row.keys[0]
        }
      });
      metrics.push({
        "name": "google.search.console.position",  // position
        "type": "gauge",
        "value": row.position,
        "timestamp": currentTimestamp,
        "attributes": {
          "config.url": config.url,
          "page": row.keys[0]
        }
      });
    }
    chunkAndPostMetrics(metrics);
  } catch (error) {
    assert.ok(!error, "Error calling Google Search API:", error);
  }
}


/**
 * Function to chunk the posting of dimensional metrics through the New Relic Metric API.
 * @param {*} array an array of data to be posted in chunks.
 */
function chunkAndPostMetrics(array) {
  // Break out array into dimensional metrics
  let chunkedArray = [];
  Array.from({
    length: Math.ceil(array.length / CHUNK_SIZE)
  }, (val, i) => {
    chunkedArray.push(array.slice(i * CHUNK_SIZE, i * CHUNK_SIZE + CHUNK_SIZE));
  });
  // Send to the Event API
  chunkedArray.forEach(chunk => {
    const metricsPayload = [{
      "metrics": chunk
    }];
    let body = JSON.stringify(metricsPayload, null, 2);
    postMetrics(body);
  });
}


/**
 * Function to post metrics through the New Relic Metrics API.
 * @param {*} body a JSON object with metrics in the New Relic Metric API format.
 */
async function postMetrics(body) {
  let options = {
    url: metricApiEndpoint,
    body: body,
    headers: {
      'Api-Key': $secure.GSC_INSERT_LICENSE_API_KEY,
      'Content-Type': 'application/json'
    },
    retry: { // By default, Got does not retry on POST
      limit: MAX_RETRIES,
      methods: ['POST']
    }
  }
  let response;
  try {
    response = await got.post(options);
    let responseBody = JSON.parse(response.body);
    if (responseBody.hasOwnProperty('errors')) {
      console.error("postMetrics(): An error occurred:", responseBody.errors);
    }
  } catch (error) {
    console.error("postMetrics(): An error occurred:", error);
  }
}


/**
 * The script's main function and starting point.
 */
async function main() {
  let jwt = await getJwt();
  let token = await getToken(jwt);
  await querySearchConsole(token);
}


main();