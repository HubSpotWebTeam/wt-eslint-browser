const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

const { ENV } = process.env;
const DEV = 'dev';
const QA = 'qa';
const PROD = 'prod';
const currentEnv = ENV || QA;

/**
 * @returns {string|null} The `baseUrl` set for the `DEV` portal in `hubspot.config.yml`
 *   or `null` if this is not the dev environment or no such property exists.
 */
export const envs = {
  currentEnv,
  DEV,
  QA,
  PROD,
}
export const getDevBaseUrl = () => {
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
export const config = {
  env: {
    env: currentEnv,
    isProd: currentEnv === PROD,
    isQA: currentEnv === QA,
    isDev: currentEnv === DEV,
  },
  chromeWebSecurity: false,
  reporter: 'mochawesome',
  video: false,
  reporterOptions: {
    reportDir: 'cypress/reports/mochawesome-report',
    overwrite: false,
    html: false,
    json: true,
    timestamp: 'yyyymmdd-HHMMss',
  },
};
