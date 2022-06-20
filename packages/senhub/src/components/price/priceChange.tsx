import { useCallback, useEffect, useState } from 'react'
import { numeric } from 'shared/util'

import { fetchCGK } from 'shared/util'
import { parseColor } from './parseColor'

const PriceChange = ({
  ticket,
  colorized = false,
}: {
  ticket: string
  colorized?: boolean
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
  return (
    <span style={{ color: colorized ? color : 'inherit' }}>
      {numeric(Math.abs(cgkData?.priceChange)).format('0.[0]')}%
    </span>
  )
}

export default PriceChange
