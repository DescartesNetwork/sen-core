import { RootState, useRootSelector } from 'store'

export const useWalletAddress = () => {
  const walletAddress = useRootSelector(
    (state: RootState) => state.wallet.address,
  )
  return walletAddress
}

export const useWalletBalance = () => {
  const lamports = useRootSelector((state: RootState) => state.wallet.lamports)
  return lamports
}
