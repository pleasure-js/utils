import { readdirAsync } from './readdir-async.js'
import castArray from 'lodash/castArray'
import flattenDeep from 'lodash/flattenDeep'
import each from 'lodash/each'
import util from 'util'
import path from 'path'
import fs from 'fs'

const lstat = util.promisify(fs.lstat)

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
export async function deepScanDir (directory, { exclude = [/node_modules/], filter, only = [] } = {}) {
  const files = (await readdirAsync(directory)).map(file => {
    return new Promise(async (resolve) => {
      file = path.join(directory, file)

      let excluded = false
      let included = only.length === 0

      each(castArray(exclude), pattern => {
        if (typeof pattern === 'string' && file.indexOf(pattern) >= 0) {
          excluded = true
          return false
        }

        if (pattern instanceof RegExp && pattern.test(file)) {
          excluded = true
          return false
        }
      })

      if (excluded) {
        return resolve()
      }

      const isDirectory = (await lstat(file)).isDirectory()

      if (!isDirectory && filter && !await filter(file)) {
        return resolve()
      }

      if (isDirectory) {
        // found = found.concat(await deepScanDir(file, { exclude, filter, only }))
        return resolve(deepScanDir(file, { exclude, filter, only }))
      }

      each(castArray(only), pattern => {
        if (typeof pattern === 'string' && file.indexOf(pattern) >= 0) {
          included = true
          return false
        }

        if (pattern instanceof RegExp && pattern.test(file)) {
          included = true
          return false
        }
      })

      if (!included) {
        return resolve()
      }

      return resolve(file)
    })
  })
  return flattenDeep(await Promise.all(files)).filter(Boolean)
}
