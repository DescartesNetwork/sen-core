import { net, env } from 'shared/runtime'
import sol from './sol.config'
import register from './register.config'
import api from './api.config'
import admin from './admin.config'

const configs = {
  sol: sol[net],
  register: register[env],
  api: api[env],
  admin: admin[env],
}

/**
 * Module exports
 */
export default configs
