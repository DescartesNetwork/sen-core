import { env, net } from '@sentre/senhub'
import manifest from './manifest.config'
import sol from './sol.config'

const configs = {
  manifest: manifest[env],
  sol: sol[net],
}

/**
 * Module exports
 */
export default configs
