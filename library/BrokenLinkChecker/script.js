const assert = require('assert');
const $http = require('request');
const parse = require('url-parse');
const By = $driver.By;

// Replace with the URL you want to check for broken links
const urlToCheck = 'https://www.example.com/';

const domainsToIgnore = [
  'www.instagram.com',
  'www.linkedin.com'
];

$browser.get(urlToCheck)
  .then(function() {
    // find all 'a' elements
    return $browser.findElements(By.tagName('a'));
  })
  .then(function(links) {
    // for each link...
    return links.forEach(function(link) {
      // get link target
      return link.getAttribute('href')
        .then(function(href) {
          // if href is not missing or empty...
          if (href != null && href != '') {
            // skip mailto and tel links
            if (!href.startsWith('mailto') && !href.startsWith('tel')) {
              var domain = parse(href).hostname;
              // if target is not in list of excluded domains...
              if (!domainsToIgnore.includes(domain)) {
                // send HEAD request and check response
                return $http.head(href, callback);
              }
            }
          }
        });
    });
  });

  function callback(error, response, body) {
    if (response != null) {
      assert.ok(response.statusCode != 404, 'Broken link found: ' + response.request.uri.href);
    }
  }