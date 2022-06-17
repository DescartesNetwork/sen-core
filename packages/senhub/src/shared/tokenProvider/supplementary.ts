// Pseudo native sol info
// It's for all networks
export const sol = (chainId: 101 | 102 | 103) => ({
  symbol: 'SOL',
  name: 'Solana',
  address: '11111111111111111111111111111111',
  decimals: 9,
  chainId,
  extensions: {
    coingeckoId: 'solana',
  },
  logoURI:
    'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
})

// Pseudo SNTR info
// Only for devnet and testnet
export const sntr = (chainId: 102 | 103) => ({
  symbol: 'SNTR',
  name: 'Sentre',
  address: '5YwUkPdXLoujGkZuo9B4LsLKj3hdkDcfP4derpspifSJ',
  decimals: 9,
  chainId,
  extensions: {
    coingeckoId: 'sentre',
  },
  logoURI:
    'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/SENBBKVCM7homnf5RX9zqpf1GFe935hnbU4uVzY1Y6M/logo.png',
})

// Pseudo token infos for devnet
const supplementary = [
  sol(103),
  sntr(103),
  {
    symbol: 'wBTC',
    name: 'Wrapped Bitcoin',
    address: '8jk4eJymMfNZV9mkRNxJEt2VJ3pRvdJvD5FE94GXGBPM',
    decimals: 9,
    chainId: 103,
    extensions: {
      coingeckoId: 'bitcoin',
    },
    logoURI:
      'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/qfnqNqs3nCAHjnyCgLRDbBtq4p2MtHZxw8YjSyYhPoL/logo.png',
  },
  {
    symbol: 'wETH',
    name: 'Ethereum',
    address: '27hdcZv7RtuMp75vupThR3T4KLsL61t476eosMdoec4c',
    decimals: 9,
    chainId: 103,
    extensions: {
      coingeckoId: 'ethereum',
    },
    logoURI:
      'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/FeGn77dhg1KXRRFeSwwMiykZnZPw5JXW6naf2aQgZDQf/logo.png',
  },
  {
    symbol: 'UNI',
    name: 'Uniswap',
    address: 'FVZFSXu3yn17YdcxLD72TFDUqkdE5xZvcW18EUpRQEbe',
    decimals: 9,
    chainId: 103,
    extensions: {
      coingeckoId: 'uniswap',
    },
    logoURI:
      'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/3MVa4e32PaKmPxYUQ6n8vFkWtCma68Ld7e7fTktWDueQ/logo.png',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '2z6Ci38Cx6PyL3tFrT95vbEeB3izqpoLdxxBkJk2euyj',
    decimals: 9,
    chainId: 103,
    extensions: {
      coingeckoId: 'usd-coin',
    },
    logoURI:
      'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
  },
]

export default supplementary
