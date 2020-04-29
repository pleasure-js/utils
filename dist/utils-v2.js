/*!
 * @pleasure-js/utils-v2 v1.0.0
 * (c) 2020-2020 Martin Rafael Gonzalez <tin@devtin.io>
 * MIT
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = require('fs');
var fs__default = _interopDefault(fs);
var util = _interopDefault(require('util'));
var castArray = _interopDefault(require('lodash/castArray'));
var flattenDeep = _interopDefault(require('lodash/flattenDeep'));
var each = _interopDefault(require('lodash/each'));
var path = _interopDefault(require('path'));
var merge = _interopDefault(require('deepmerge'));

const readdirAsync = util.promisify(fs__default.readdir);

const lstat = util.promisify(fs__default.lstat);

/**
 * Deep scans the given `directory` returning an array of strings of all of the files found in the given `directory`.
 *
 * @param {String} directory - The directory to scan
 * @param {String[]|RegExp[]} [exclude=[/node_modules/]] - Paths to exclude
 * @param {String[]|RegExp[]} [only=[]] - If present, only paths matching at least one of the expressions,
 * would be included.
 * @param {Function} [filter] - Callback function called with the evaluated `path` as the first argument. Must return
 * `true` or `false`
 * @return {Promise<String[]>} Paths found
 */
async function deepScanDir (directory, { exclude = [/node_modules/], filter, only = [] } = {}) {
  const files = (await readdirAsync(directory)).map(file => {
    return new Promise(async (resolve) => {
      file = path.join(directory, file);

      let excluded = false;
      let included = only.length === 0;

      each(castArray(exclude), pattern => {
        if (typeof pattern === 'string' && file.indexOf(pattern) >= 0) {
          excluded = true;
          return false
        }

        if (pattern instanceof RegExp && pattern.test(file)) {
          excluded = true;
          return false
        }
      });

      if (excluded) {
        return resolve()
      }

      const isDirectory = (await lstat(file)).isDirectory();

      if (!isDirectory && filter && !await filter(file)) {
        return resolve()
      }

      if (isDirectory) {
        // found = found.concat(await deepScanDir(file, { exclude, filter, only }))
        return resolve(deepScanDir(file, { exclude, filter, only }))
      }

      each(castArray(only), pattern => {
        if (typeof pattern === 'string' && file.indexOf(pattern) >= 0) {
          included = true;
          return false
        }

        if (pattern instanceof RegExp && pattern.test(file)) {
          included = true;
          return false
        }
      });

      if (!included) {
        return resolve()
      }

      return resolve(file)
    })
  });
  return flattenDeep(await Promise.all(files)).filter(Boolean)
}

/**
 * Finds package.json file in given dir or nearest found in parent directories
 * @param {String} [dir=process.cwd()]
 * @return {String} path to the nearest package.json
 */
function findPackageJson (dir = process.cwd()) {
  const local = path.join(dir, 'package.json');

  if (!fs.existsSync(local)) {
    if (dir === '/') {
      return ''
    }

    return findPackageJson(path.join(dir, '../'))
  }

  return local
}

/**
 * Finds the root of a project (where the `pleasure.config.js` resides).
 * @param {String|String[]} [paths] - Optional resolve the given path(s) from the root.
 * @return {String} The path to the project. When given extra arguments, it will resolve those as paths from the
 * found root.
 *
 * @example <caption>Returning the location to the package.json file</caption>
 *
 * e.g. imaging running the code below from a project at path `/Users/tin/my-kick-ass-project`
 *
 * ```js
 * // prints: /Users/tin/my-kick-ass-project/package.json
 * console.log(findRoot('package.json'))
 * ```
 */
function findRoot (...paths) {
  return path.resolve(process.env.PLEASURE_ROOT || path.dirname(findPackageJson()), ...paths)
}

/**
 * Locates the pleasure.config.js file. Alternatively returns the env variable PLEASURE_CONFIG if set.
 * @return {String} pleasure config found
 */
function findConfig () {
  return process.env.PLEASURE_CONFIG || findRoot('pleasure.config.js')
}

/**
 * @typedef {Object} ProjectConfig
 * @property {Object} http - http orchestration configuration
 * @property {String} [http.host=0.0.0.0] - http orchestration configuration
 * @property {Number} [http.port=3000] - port where to run the http server
 * @property {Number} [api.dir=api] - relative path to the api folder to use
 */
const ProjectConfig = {
  config: {
    http: {
      host: '0.0.0.0',
      port: 3000
    },
    api: {
      dir: 'api/',
      prefix: '/api',
      flux: {
        join: null,
        deliver: null
      }
    },
    entities: {
      dir: 'entities/',
      prefix: '/entities'
    },
    plugins: {
      dir: 'plugins/'
    }
  }
};

function getConfig () {
  const configFile = findConfig();
  return merge.all([{}, ProjectConfig, fs__default.existsSync(configFile) ? (require(configFile).default || require(configFile)) : {}])
}

function packageJson () {
  const file = findRoot('./package.json');

  if (!fs__default.existsSync(file)) {
    return {}
  }

  return require(file)
}

exports.ProjectConfig = ProjectConfig;
exports.deepScanDir = deepScanDir;
exports.findConfig = findConfig;
exports.findPackageJson = findPackageJson;
exports.findRoot = findRoot;
exports.getConfig = getConfig;
exports.packageJson = packageJson;
exports.readdirAsync = readdirAsync;
