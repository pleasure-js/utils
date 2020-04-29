import { findConfig } from './find-config.js'
import fs from 'fs'
import merge from 'deepmerge'

/**
 * @typedef {Object} ProjectConfig
 * @property {Object} http - http orchestration configuration
 * @property {String} [http.host=0.0.0.0] - http orchestration configuration
 * @property {Number} [http.port=3000] - port where to run the http server
 * @property {Number} [api.dir=api] - relative path to the api folder to use
 */
export const ProjectConfig = {
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
}

export function getConfig () {
  const configFile = findConfig()
  return merge.all([{}, ProjectConfig, fs.existsSync(configFile) ? (require(configFile).default || require(configFile)) : {}])
}
