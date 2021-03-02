const ENV = process.env.NODE_ENV || 'development';
let URL_ROOT = 'https://newrelic.github.io/quickstarts-synthetics-library';
if (ENV === 'development') {
  URL_ROOT = 'http://localhost:3000/quickstarts-dashboard-library';
}

export const URL_DATA_FOLDER = `${URL_ROOT}/data`;
export const URL_DATA_FILE = `${URL_ROOT}/data.json`;
