import { useCallback, useEffect, useState, useMemo } from 'react'

import { useRootSelector, RootState } from 'store'
import { numeric, fetchCGK } from 'shared/util'

const SolBalance = ({ inUSD = false }: { inUSD?: boolean }) => {
  const [cgkData, setCGKData] = useState<CgkData>()
  const lamports = useRootSelector((state: RootState) => state.wallet.lamports)

  const balance = numeric(lamports / 10 ** 9).format('0.[000]')
  const usd = useMemo(() => {
    return numeric((lamports / 10 ** 9) * (cgkData?.price || 0)).format(
      '0,0.[000]',
    )
  }, [lamports, cgkData])

  const getCGKData = useCallback(async () => {
    const cgkData = await fetchCGK('solana')
    return setCGKData(cgkData)
  }, [])

  useEffect(() => {
    getCGKData()
  }, [getCGKData])

  return <span>{inUSD ? `$${usd}` : balance}</span>
}

export default SolBalance
