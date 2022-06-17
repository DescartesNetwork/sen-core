import { net, env } from 'shared/runtime'
import sol from './sol.config'
import register from './register.config'

const configs = {
  sol: sol[net],
  register: register[env],
}

/**
 * Module exports
 */
export default configs
