import { Env } from 'shared/runtime'

/**
 * Contructor
 */

type Conf = {
  adminAddresses: string[]
}

const conf: Record<Env, Conf> = {
  /**
   * Development configurations
   */
  development: {
    adminAddresses: [
      '8W6QginLcAydYyMYjxuyKQN56NzeakDE3aRFrAmocS6D',
      'pkGvE888eDrat79x46p2EmNNYspUsgvLKL9ynU9qSNW',
      '2Mdbxjidw1oHPwkSsFqfaFcYHjLUrNdkVt98Xc1K5dac',
    ],
  },

  /**
   * Production configurations
   */
  production: {
    adminAddresses: [
      '8W6QginLcAydYyMYjxuyKQN56NzeakDE3aRFrAmocS6D',
      'pkGvE888eDrat79x46p2EmNNYspUsgvLKL9ynU9qSNW',
      '2Mdbxjidw1oHPwkSsFqfaFcYHjLUrNdkVt98Xc1K5dac',
    ],
  },
}

/**
 * Module exports
 */
export default conf
