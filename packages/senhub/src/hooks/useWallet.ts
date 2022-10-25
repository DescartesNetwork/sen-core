import { useLocation } from 'react-router-dom'

import { RootState, useRootSelector } from 'store'

export const useWalletAddress = () => {
  const address = useRootSelector(({ wallet }: RootState) => wallet.address)
  return address
}

export const useWalletBalance = () => {
  const lamports = useRootSelector(({ wallet }: RootState) => wallet.lamports)
  return lamports
}

export const useGuestMode = () => {
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const guestMode = params.get('guestMode') === 'true' ? true : false
  return guestMode
}
