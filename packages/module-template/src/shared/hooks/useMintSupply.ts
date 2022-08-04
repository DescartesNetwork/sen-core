import { useMintData } from '@sentre/senhub'
import BN from 'bn.js'

/**
 * Get token's total supply. This hook needs MintProvider for working.
 * MintProvider Ref: https://docs.sentre.io/senhub/development/providers/mint-provider
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
