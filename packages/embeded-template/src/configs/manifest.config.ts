import { Env } from '@sentre/senhub'

if (
  typeof process.env.REACT_APP_ID !== 'string' ||
  typeof process.env.REACT_APP_URL !== 'string'
)
  throw new Error('Please add REACT_APP_ID, REACT_APP_URL in .env!')

/**
 * Contructor
 */

type Conf = {
  appId: string
  url: string
}

const shared = {
  appId: process.env.REACT_APP_ID,
  url: process.env.REACT_APP_URL,
}

const conf: Record<Env, Conf> = {
  /**
   * Development configurations
   */
  development: {
    ...shared,
  },

  /**
   * Production configurations
   */
  production: {
    ...shared,
  },
}

/**
 * Module exports
 */
export default conf
