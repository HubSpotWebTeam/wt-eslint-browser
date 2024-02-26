const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor');
const allureWriter = require('@shelex/cypress-allure-plugin/writer');
const webpack = require('@cypress/webpack-preprocessor');

const DEV = 'DEV';
const QA = 'QA';
const PROD = 'prod';
const currentEnv = QA;

const envs = {
  currentEnv,
  DEV,
  QA,
  PROD,
}

/**
 * 
 * @param {string} currDir - the current working directory path to search from
 * @returns {string} The absolute path of the project's root directory
 */
const getRootDir = (currDir) => {
  if (fs.existsSync(path.join(currDir, 'hubspot.config.yml'))) return currDir;
  const parentDir = path.dirname(currDir);
  if (parentDir === currDir) global.console.error('Error: Could not find the hubspot.config.yml file within the projects directories.');
  return getRootDir(parentDir);
}

/**
 * @returns {string|null} The `baseUrl` set for the `DEV` portal in `hubspot.config.yml`
 *   or `null` if this is not the dev environment or no such property exists.
 */
const getDevBaseUrl = () => {
  try {
    const root = getRootDir(__dirname);
    const configPath = path.resolve(root, 'hubspot.config.yml');
    const config = fs.readFileSync(configPath, 'utf8');
    const { portals } = yaml.load(config);
    const devPortal = portals.find(portal => portal.name === 'DEV');
    const devBaseUrl = devPortal.baseUrl;
    return devBaseUrl ? devBaseUrl : null;
  } catch (error) {
    global.console.error(error);
  }

  global.console.log(
    'To test a dev URL, add the `baseUrl` property to your `DEV` portal configuration in `hubspot.config.yml`',
  );
};

const e2e = {
  specPattern: 'cypress/e2e/*.cy.js',
  testIsolation: false,
  async setupNodeEvents(on, config) {
    const webpackOptions = {
      resolve: {
        extensions: ['.ts', '.js'],
      },
      module: {
        rules: [
          {
            test: /\.feature$/,
            use: [
              {
                loader: '@badeball/cypress-cucumber-preprocessor/webpack',
                options: config,
              },
            ],
          },
        ],
      },
    };

    await addCucumberPreprocessorPlugin(on, config);
    on('file:preprocessor', webpack(webpackOptions));
    allureWriter(on, config);
    return config
  },
};

const env = {
  allure: true,
  allureLogGherkin: true,
  allureReuseAfterSpec: true,
};

const config = {
  chromeWebSecurity: false,
  defaultCommandTimeout: 20000,
  e2e,
  env,
  numTestsKeptInMemory: 0,
  pageLoadTimeout: 20000,
  port: 3500,
  responseTimeout: 20000,
  retries: {
    runMode: 1,
    openMode: 0,
  },
  screenshotOnRunFailure: true,
  trashAssetsBeforeRuns: true,
  video: false,
  viewportHeight: 660,
  viewportWidth: 1350,
};

module.exports = {
  config,
  envs,
  getDevBaseUrl,
}