import { PublicKey } from '@solana/web3.js'
import { utils } from '@senswap/sen-js'
import numbro from 'numbro'

import { net } from 'shared/runtime'
import { DataLoader } from './dataloader'

/**
 * Delay by async/await
 * @param ms - milisenconds
 * @returns
 */
export const asyncWait = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Shorten a long address
 * @param address - The long address
 * @param num - The number of the heading and trailing characters
 * @param delimiter - The delimiter
 * @returns Shortened address
 */
export const shortenAddress = (address: string, num = 4, delimiter = '...') => {
  return (
    address.substring(0, num) +
    delimiter +
    address.substring(address.length - num, address.length)
  )
}

/**
 * Build a explorer url by context including addresses or transaction ids
 * @param addressOrTxId - Address or TxId
 * @returns
 */
export const explorer = (addressOrTxId: string): string => {
  if (isAddress(addressOrTxId)) {
    return `https://solscan.io/account/${addressOrTxId}?cluster=${net}`
  }
  return `https://solscan.io/tx/${addressOrTxId}?cluster=${net}`
}

/**
 * Wrapped Numbro - https://numbrojs.com/old-format.html
 * @param value - value
 * @returns
 */
export const numeric = (
  value?: number | string | bigint,
): ReturnType<typeof numbro> => {
  if (!value) return numbro('0')
  return numbro(value)
}

/**
 * Generate a random color
 * @param seed - Seed
 * @param opacity - Opacity
 * @returns
 */
export const randomColor = (seed?: string, opacity?: string | number) => {
  let hash = Math.floor(Math.random() * 16777215)
  if (seed) {
    hash = 0
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash)
    }
  }
  const rgb = [0, 0, 0]
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 255
    rgb[i] = value
  }
  return `rgba(${rgb[0]}, 100, ${rgb[1]},${opacity || 1})`
}

/**
 * Fetch coingecko data with cache
 * @param ticket - Token ticket
 * @returns
 */
export const fetchCGK = async (ticket = '') => {
  return DataLoader.load('fetchCGK' + ticket, () => utils.parseCGK(ticket))
}

/**
 * Randomly choose an element in the input array
 * @param arr - Original array of elements
 * @returns
 */
export const randChoose = <T>(arr: T[]): T => {
  const rand = Math.floor(Math.random() * arr.length)
  return arr[rand]
}

/**
 * Randomize a subarray in the input array with a specific number of elements
 * @param arr - Original array of elements
 * @param num - Number of elements in randomized subarray
 * @returns
 */
export const randElements = <T>(arr: T[], num: number): T[] => {
  if (arr.length < num) return [...arr]
  const re: T[] = []
  while (re.length < num) {
    const el = randChoose(arr)
    if (!re.includes(el)) re.push(el)
  }
  return re
}

export const SPL_TOKEN_PROGRAM = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
export const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM =
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'

/**
 * Validate Solana address
 * @param address Solana address
 * @returns true/false
 */
export const isAddress = (address: string | undefined): address is string => {
  if (!address) return false
  try {
    const publicKey = new PublicKey(address)
    if (!publicKey) throw new Error('Invalid public key')
    return true
  } catch (er) {
    return false
  }
}

/**
 * Derive SPL Associated Token Account address
 * @param walletAddress Wallet address
 * @param mintAddress Mint address
 * @returns The SPL ATA address
 */
export const deriveAssociatedAddress = async (
  walletAddress: string,
  mintAddress: string,
) => {
  if (!isAddress(walletAddress)) throw new Error('Invalid wallet address')
  if (!isAddress(mintAddress)) throw new Error('Invalid mint address')
  const [publicKey] = await PublicKey.findProgramAddress(
    [
      new PublicKey(walletAddress).toBuffer(),
      new PublicKey(SPL_TOKEN_PROGRAM).toBuffer(),
      new PublicKey(mintAddress).toBuffer(),
    ],
    new PublicKey(SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM),
  )
  return publicKey.toBase58()
}
