import { Env } from 'shared/runtime'

/**
 * Contructor
 */

type BasicEndpoint = { index: string } & Record<string, string>
type Conf = {
  origin: string
  health: BasicEndpoint
  user: BasicEndpoint
}

const generator = (origin: string): Conf => ({
  origin,
  health: {
    index: origin + '/health',
    get cookie() {
      return this.index + '/cookie'
    },
  },
  user: {
    index: origin + '/user',
    get login() {
      return this.index + '/login'
    },
    get logout() {
      return this.index + '/logout'
    },
  },
})

const conf: Record<Env, Conf> = {
  /**
   * Development configurations
   */
  development: {
    ...generator('http://localhost:10000'),
  },

  /**
   * Production configurations
   */
  production: {
    ...generator('https://api.sentre.io'),
  },
}

/**
 * Module exports
 */
export default conf
