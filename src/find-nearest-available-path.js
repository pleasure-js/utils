import { existsSync } from 'fs'
import path from 'path'

/**
 * Finds given `pathName` in given `dir`. Will look for parent dirs of given `dir` until found or `/` is reached.
 *
 * @param {String} dir=process.cwd()
 * @param {String} pathName
 * @return {String|void} path to the nearest file or `void` if none found
 */
export function findNearestAvailablePath (dir, pathName) {
  dir = dir || process.cwd()
  const local = path.join(dir, pathName)

  if (!existsSync(local)) {
    if (dir === '/') {
      return
    }

    return findNearestAvailablePath(path.join(dir, '../'), pathName)
  }

  return local
}
