const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor');
const allureWriter = require('@shelex/cypress-allure-plugin/writer');
const webpack = require('@cypress/webpack-preprocessor');

const { ENV } = process.env;
const DEV = 'dev';
const QA = 'qa';
const PROD = 'prod';
const currentEnv = ENV || QA;

const envs = {
  currentEnv,
  DEV,
  QA,
  PROD,
}

/**
 * @returns {string|null} The `baseUrl` set for the `DEV` portal in `hubspot.config.yml`
 *   or `null` if this is not the dev environment or no such property exists.
 */
const getDevBaseUrl = () => {
  if (ENV === DEV) {
    try {
      const configPath = path.resolve(__dirname, 'hubspot.config.yml');
      const config = fs.readFileSync(configPath, 'utf8');
      const { portals } = yaml.load(config);
      const devPortal = portals.find(portal => portal.name === 'DEV');
      const devBaseUrl = devPortal.baseUrl;
      if (devBaseUrl) return devBaseUrl;
    } catch (error) {
      global.console.error(error);
    }

    global.console.log(
      'To test a dev URL, add the `baseUrl` property to your `DEV` portal configuration in `hubspot.config.yml`',
    );
  }
  return null;
};

async function setupNodeEvents(on, config) {
  // This is required for the preprocessor to be able to generate JSON reports after each run
  await addCucumberPreprocessorPlugin(on, config);
  on(
    'file:preprocessor',
    webpack({
      webpackOptions: {
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
      },
    })
  );
  allureWriter(on, config);
  // Make sure to return the config object as it might have been modified by the plugin.
  return config;
}

const e2e = {
  specPattern: 'cypress/e2e/*.cy.js',
  setupNodeEvents,
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