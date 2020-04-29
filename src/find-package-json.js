import { existsSync } from 'fs'
import path from 'path'

/**
 * Finds package.json file in given dir or nearest found in parent directories
 * @param {String} [dir=process.cwd()]
 * @return {String} path to the nearest package.json
 */
export function findPackageJson (dir = process.cwd()) {
  const local = path.join(dir, 'package.json')

  if (!existsSync(local)) {
    if (dir === '/') {
      return ''
    }

    return findPackageJson(path.join(dir, '../'))
  }

  return local
}
