const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor');
const allureWriter = require('@shelex/cypress-allure-plugin/writer');
const webpack = require('@cypress/webpack-preprocessor');

const DEV = 'DEV';
const QA = 'qa';
const PROD = 'prod';
const currentEnv = QA;

const envs = {
  currentEnv,
  DEV,
  QA,
  PROD,
};

/**
 * @description Recursively climbs up the filepath, until it finds what directory
 * the directory where the hubspot.config.yml file is located.
 *
 * @param {string} currDir - the current working directory path to search from
 * @returns {string} The absolute path of the project's root directory
 */
const getRootDir = currDir => {
  if (fs.existsSync(path.join(currDir, 'hubspot.config.yml'))) return currDir;
  const parentDir = path.dirname(currDir);
  if (parentDir === currDir)
    global.console.error('Error: Could not find the hubspot.config.yml file within the projects directories.');
  return getRootDir(parentDir);
};

/**
 * @returns {string|null} The `baseUrl` set for the `DEV` portal in `hubspot.config.yml`
 *   or `null` if this is not the dev environment or no such property exists.
 */
const getDevBaseUrl = () => {
  try {
    global.console.log(
      'To test a dev URL, add the `baseUrl` property to your `DEV` portal configuration in `hubspot.config.yml`',
    );

    const root = getRootDir(__dirname);
    const configPath = path.resolve(root, 'hubspot.config.yml');
    const config = fs.readFileSync(configPath, 'utf8');
    const { portals } = yaml.load(config);
    const devPortal = portals.find(portal => portal.name === 'DEV');
    const devBaseUrl = devPortal.baseUrl;
    return devBaseUrl || null;
  } catch (error) {
    global.console.error(error);
    return null;
  }
};

/**
 * @description Get the baseUrls for different environments from the ci config file for local test execution.
 * @returns {object} baseUrls - The base urls object
 */
const getBaseUrls = () => {
  let fileContents = '';
  let ciConfig = {};
  const baseUrls = {};
  baseUrls[envs.DEV] = getDevBaseUrl();

  const fileExist = fs.existsSync('.ci/config.yml');
  if (fileExist) {
    fileContents = fs.readFileSync('.ci/config.yml', 'utf8');
    ciConfig = yaml.load(fileContents);
    if (ciConfig.regression.e2eTestEnvironment && ciConfig.regression.e2eTestEnvironment.length > 0) {
      try {
        ciConfig.regression.e2eTestEnvironment.forEach(item => {
          const envName = item.name;
          baseUrls[envName] = item.url;
        });
      } catch (error) {
        console.error('Error reading the base urls from the ci config file:', error);
        return null;
      }
    }
  }
  return baseUrls || null;
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
              test: /\.ts$/,
              exclude: [/node_modules/],
              use: [
                {
                  loader: 'ts-loader',
                },
              ],
            },
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
    }),
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
  viewportHeight: 1080,
  viewportWidth: 1920,
};

module.exports = {
  config,
  envs,
  getDevBaseUrl,
  getBaseUrls,
};
