/** API SETUP - remove this section to run in New Relic Synthetics **/
// if ($http == null) { var $http = require('request'); }
/** API SETUP - remove this section to run in New Relic Synthetics **/

const settings = {'url': 'https://www.google.com', 'category': 'performance', 'strategy': 'desktop'};

const options = {
  method: 'GET',
  url: 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed?key=' + $secure.PAGESPEED_INSIGHTS_API_KEY,
  headers: undefined,
  searchParams: settings
};

try {
	const response = $http(options);
  if (response.statusCode == 200) {
    const lighthouseMetrics = response.body.lighthouseResult.audits.metrics.details.items[0];
    $util.insights.set('url', settings.url);
    $util.insights.set('deviceType', settings.strategy);
    $util.insights.set('performanceScore', response.body.lighthouseResult.categories.performance.score);

    for (let attributeName in lighthouseMetrics) {
      if ( lighthouseMetrics.hasOwnProperty(attributeName) ) {
        if (!attributeName.includes('Ts')) {
          console.log(attributeName + ": " + lighthouseMetrics[attributeName]);
          $util.insights.set(attributeName, lighthouseMetrics[attributeName]);
        }
      }
    }

  } else {
    console.log('Non-200 HTTP response: ' + response.statusCode);
  }
} catch (error) {
  console.log(error);
}
