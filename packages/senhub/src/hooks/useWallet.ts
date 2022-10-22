import { RootState, useRootSelector } from 'store'

export const useWalletAddress = () => {
  const address = useRootSelector(({ wallet }: RootState) => wallet.address)
  return address
}

export const useWalletBalance = () => {
  const lamports = useRootSelector(({ wallet }: RootState) => wallet.lamports)
  return lamports
}
