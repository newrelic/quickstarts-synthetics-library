const fs = require('fs');
const yaml = require('js-yaml');
const winston = require('winston');

// Initiate logger
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [new winston.transports.Console()],
});

// First argument should be path to quickstarts folder
const directory = process.argv[2];

//
// Read all quickstarts, filter out the ones starting with _ and process each
//
const quickstarts = fs
  .readdirSync(directory)
  .filter((element) => !element.startsWith('_'))
  .map(processQuickstart);

//
// Process a quickstarts element
//
function processQuickstart(element) {
  //
  // Quickstart data
  //
  const quickstart = {
    name: '',
    description: '',
    authors: [],
    type: '',
    monitorType: '',
    script: '',
  };

  // Sanity check on directory name
  if (!element.match(/^[a-zA-Z0-9-]*$/)) {
    logger.error(
      `Unsupported directory name "${element}", please only use letters, numbers, and dashes. No spaces allowed.`
    );
  }

  //
  // Read config and store attributes
  //
  const configContents = fs.readFileSync(
    `${directory + element}/config.yml`,
    'utf8'
  );
  const config = yaml.safeLoad(configContents);
  quickstart.id = element;
  quickstart.name = config.name || element;
  quickstart.description = config.description || '';
  quickstart.authors = config.authors || [];
  quickstart.type = config.type || '';
  quickstart.monitorType = config.monitorType || '';

  // Check for valid type and monitorType
  if (quickstart.type !== 'Snippet' && quickstart.type !== 'Template') {
    logger.error(
      `Unknown type for "${element}", please use 'Snippet' or 'Template'`
    );
  }
  if (
    quickstart.monitorType !== 'SCRIPT_BROWSER' &&
    quickstart.monitorType !== 'SCRIPT_API'
  ) {
    logger.error(
      `Unknown type for "${element}", please use 'SCRIPT_BROWSER' or 'SCRIPT_API'`
    );
  }

  //
  // Read directory and import js file
  //
  if (!fs.existsSync(`${directory + element}/script.js`)) {
    logger.error(`Can't find script file for "${element}".`);
  }

  return quickstart;
}

//
// Write out data for use in front-end
//
const json = JSON.stringify({
  quickstarts: quickstarts,
});
fs.writeFileSync('data.json', json);
