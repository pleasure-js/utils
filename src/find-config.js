import { findRoot } from './find-root.js'

/**
 * Locates the pleasure.config.js file. Alternatively returns the env variable PLEASURE_CONFIG if set.
 * @return {String} pleasure config found
 */
export function findConfig () {
  return process.env.PLEASURE_CONFIG || findRoot('pleasure.config.js')
}
