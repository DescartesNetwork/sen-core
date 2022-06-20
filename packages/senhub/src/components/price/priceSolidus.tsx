import { useCallback, useEffect, useState } from 'react'

import { fetchCGK } from 'shared/util'
import { parseColor } from './parseColor'

const PriceSolidus = ({
  ticket,
  colorized = false,
  symbol = '/',
}: {
  ticket: string
  colorized?: boolean
  symbol?: string
}) => {
  const [cgkData, setCGKData] = useState<CgkData>()

  const getCGKData = useCallback(async () => {
    const cgkData = await fetchCGK(ticket)
    return setCGKData(cgkData)
  }, [ticket])

  useEffect(() => {
    getCGKData()
  }, [getCGKData])

  const color = parseColor(cgkData?.priceChange)
  return <span style={{ color: colorized ? color : 'inherit' }}>{symbol}</span>
}

export default PriceSolidus
