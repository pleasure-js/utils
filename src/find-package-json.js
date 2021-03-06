import { findNearestAvailablePath } from './find-nearest-available-path'

/**
 * Finds package.json file in given dir or nearest found in parent directories
 * @param {String} [dir=process.cwd()]
 * @return {String} path to the nearest package.json
 */

export function findPackageJson (dir = process.cwd()) {
  return findNearestAvailablePath(dir, 'package.json')
}
