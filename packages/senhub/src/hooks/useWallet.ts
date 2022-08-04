import { RootState, useRootSelector } from 'store'

export const useWalletAddress = () => {
  const address = useRootSelector((state: RootState) => state.wallet.address)
  return address
}

export const useWalletBalance = () => {
  const lamports = useRootSelector((state: RootState) => state.wallet.lamports)
  return lamports
}
