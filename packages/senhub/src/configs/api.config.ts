import { Env } from 'shared/runtime'

/**
 * Contructor
 */

type BasicEndpoint = { index: string } & Record<string, string>
type Conf = {
  origin: string
  health: BasicEndpoint
  user: BasicEndpoint
  dapp: BasicEndpoint
  notification: BasicEndpoint
  userNotification: BasicEndpoint
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
  dapp: {
    index: origin + '/dapp',
  },
  notification: {
    index: origin + '/notification',
    get SSE() {
      return this.index + '/sse'
    },
  },
  userNotification: {
    index: origin + '/user-notification',
    get unreadCount() {
      return this.index + '/count-unread-notification'
    },
  },
})

const conf: Record<Env, Conf> = {
  /**
   * Development configurations
   */
  development: {
    ...generator('https://api.sentre.io'),
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
