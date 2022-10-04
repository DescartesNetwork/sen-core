import { Net, rpc } from 'shared/runtime'

const SOLVARS = {
  spltAddress: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  splataAddress: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',

  // SNS
  snsProgramId: 'namesLPneVptA9Z5rqUDD9tMTWEJwofgaYwp8cawRkX',
  hashPrefix: 'SPL Name Service',
  reverseLookupClass: '33m47vH6Eav6jr5Ry86XjhRft2jRBLDnDgPSHoquXi2Z',
  rootDomainAccount: '58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx',
}

/**
 * Contructor
 */
type Conf = {
  node: string
  swapAddress: string
  taxmanAddress: string
  platformFee: number
} & typeof SOLVARS

const conf: Record<Net, Conf> = {
  /**
   * Development configurations
   */
  devnet: {
    ...SOLVARS,
    node: rpc,
    swapAddress: '4erFSLP7oBFSVC1t35jdxmbfxEhYCKfoM6XdG2BLR3UF',
    taxmanAddress: '8UaZw2jDhJzv5V53569JbCd3bD4BnyCfBH3sjwgajGS9',
    platformFee: 5000,
  },

  /**
   * Staging configurations
   */
  testnet: {
    ...SOLVARS,
    node: rpc,
    swapAddress: '4erFSLP7oBFSVC1t35jdxmbfxEhYCKfoM6XdG2BLR3UF',
    taxmanAddress: '8UaZw2jDhJzv5V53569JbCd3bD4BnyCfBH3sjwgajGS9',
    platformFee: 5000,
  },

  /**
   * Production configurations
   */
  mainnet: {
    ...SOLVARS,
    node: rpc,
    swapAddress: 'SSW7ooZ1EbEognq5GosbygA3uWW1Hq1NsFq6TsftCFV',
    taxmanAddress: '9doo2HZQEmh2NgfT3Yx12M89aoBheycYqH1eaR5gKb3e',
    platformFee: 5000,
  },
}

/**
 * Module exports
 */
export default conf
