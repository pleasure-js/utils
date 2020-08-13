import { findConfig } from './find-config.js'
import fs from 'fs'
import { ProjectConfig } from './types/project-config'

export function getConfig () {
  require = require('esm')(module)
  const configFile = findConfig()
  return ProjectConfig.parse(fs.existsSync(configFile) ? (require(configFile).default || require(configFile)) : {})
}
