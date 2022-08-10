import { net, env } from 'shared/runtime'
import sol from './sol.config'
import register from './register.config'
import api from './api.config'

const configs = {
  sol: sol[net],
  register: register[env],
  api: api[env],
}

/**
 * Module exports
 */
export default configs
