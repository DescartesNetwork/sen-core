import { RootState, useRootSelector } from 'store'

export const useAccounts = () => {
  const accounts = useRootSelector((state: RootState) => state.accounts)
  return accounts
}
