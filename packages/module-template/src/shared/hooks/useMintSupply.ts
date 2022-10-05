import { useMintData } from '@sentre/senhub'
import BN from 'bn.js'

/**
 * Get token's total supply.
 * @param mintAddress Mint address
 * @returns Decimals
 */
const useMintSupply = (mintAddress: string) => {
  const {
    [mintAddress]: { supply },
  } = useMintData({ mintAddress }) || { [mintAddress]: { supply: undefined } }

  return supply !== undefined ? new BN(supply.toString()) : undefined
}

export default useMintSupply
