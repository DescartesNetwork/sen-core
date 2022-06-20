import { Env } from 'shared/runtime'

if (
  typeof process.env.REACT_APP_ID !== 'string' ||
  typeof process.env.REACT_APP_NAME !== 'string' ||
  typeof process.env.REACT_APP_URL !== 'string'
)
  throw new Error(
    'Please add REACT_APP_ID, REACT_APP_NAME, REACT_APP_URL in .env.local!',
  )

/**
 * Contructor
 */

type Conf = {
  devAppId: string
  extra: SenReg
  senreg: string
}

const DEFAULT_APP_ID = process.env.REACT_APP_ID
const devApp = {
  [DEFAULT_APP_ID]: {
    url: process.env.REACT_APP_URL,
    appId: DEFAULT_APP_ID,
    name: process.env.REACT_APP_NAME,
    author: {
      name: process.env.REACT_APP_AUTHOR_NAME || '',
      email: process.env.REACT_APP_AUTHOR_EMAIL || '',
    },
    tags: (process.env.REACT_APP_TAGS || '')
      .split(',')
      .map((tag) => tag.trim()),
    description: process.env.REACT_APP_DESCRIPTION || '',
    verified: false,
  },
}

const conf: Record<Env, Conf> = {
  /**
   * Development configurations
   */
  development: {
    devAppId: DEFAULT_APP_ID,
    extra: devApp,
    senreg: 'https://descartesnetwork.github.io/senreg/register.json',
  },

  /**
   * Staging configurations
   */
  staging: {
    devAppId: DEFAULT_APP_ID,
    extra: devApp,
    senreg: 'https://descartesnetwork.github.io/senreg/register.json',
  },

  /**
   * Production configurations
   */
  production: {
    devAppId: DEFAULT_APP_ID,
    extra: {},
    senreg: 'https://descartesnetwork.github.io/senreg/register.json',
  },
}

/**
 * Module exports
 */
export default conf
