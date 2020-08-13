/*!
 * @pleasure-js/utils v1.0.0
 * (c) 2020-2020 Martin Rafael Gonzalez <tin@devtin.io>
 * MIT
 */
import fs, { existsSync } from 'fs';
import util from 'util';
import castArray from 'lodash/castArray';
import flattenDeep from 'lodash/flattenDeep';
import each from 'lodash/each';
import path from 'path';
import { Schema } from '@devtin/schema-validator';

const readdirAsync = util.promisify(fs.readdir);

const lstat = util.promisify(fs.lstat);

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
 * Finds given `pathName` in given `dir`. Will look for parent dirs of given `dir` until found or `/` is reached.
 *
 * @param {String} dir=process.cwd()
 * @param {String} pathName
 * @return {String|void} path to the nearest file or `void` if none found
 */
function findNearestAvailablePath (dir, pathName) {
  dir = dir || process.cwd();
  const local = path.join(dir, pathName);

  if (!existsSync(local)) {
    if (dir === '/') {
      return
    }

    return findNearestAvailablePath(path.join(dir, '../'), pathName)
  }

  return local
}

/**
 * Finds package.json file in given dir or nearest found in parent directories
 * @param {String} [dir=process.cwd()]
 * @return {String} path to the nearest package.json
 */

function findPackageJson (dir = process.cwd()) {
  return findNearestAvailablePath(dir, 'package.json')
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
  return path.resolve(process.env.PLEASURE_ROOT || path.dirname(findNearestAvailablePath(process.cwd(), './pleasure.config.js') || findPackageJson()), ...paths)
}

/**
 * Locates the pleasure.config.js file. Alternatively returns the env variable PLEASURE_CONFIG if set.
 * @return {String} pleasure config found
 */
function findConfig () {
  return process.env.PLEASURE_CONFIG || findRoot('pleasure.config.js')
}

const ProjectConfig = new Schema({
  config: {
    http: {
      host: {
        type: String,
        default: '0.0.0.0'
      },
      port: {
        type: Number,
        default: 3000
      }
    },
    api: {
      dir: {
        type: String,
        default: 'api/',
        // description: 'Relative path to the api folder to use'
      },
      prefix: {
        type: String,
        default: '/api'
      },
      flux: {
        join: {
          type: Function,
          allowNull: true,
          default: null
        },
        deliver: {
          type: Function,
          allowNull: true,
          default: null
        }
      }
    },
    entities: {
      dir: {
        type: String,
        default: 'entities/'
      },
      prefix: {
        type: String,
        default: '/entities'
      }
    },
    plugins: {
      dir: {
        type: String,
        default: 'plugins/'
      }
    }
  }
});

function getConfig () {
  require = require('esm')(module);
  const configFile = findConfig();
  return ProjectConfig.parse(fs.existsSync(configFile) ? (require(configFile).default || require(configFile)) : {})
}

function packageJson () {
  const file = findRoot('./package.json');

  if (!fs.existsSync(file)) {
    return {}
  }

  return require(file)
}

/**
 * Finds package.json file in given dir or nearest found in parent directories
 * @param {String} [dir=process.cwd()]
 * @return {String} path to the nearest package.json
 */

function findPleasureConfig (dir = process.cwd()) {
  return findNearestAvailablePath(dir, 'pleasure.config.js')
}

export { deepScanDir, findConfig, findNearestAvailablePath, findPackageJson, findPleasureConfig, findRoot, getConfig, packageJson, readdirAsync };
