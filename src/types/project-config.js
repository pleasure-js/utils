import { Schema } from '@devtin/schema-validator'

export const ProjectConfig = new Schema({
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
})
