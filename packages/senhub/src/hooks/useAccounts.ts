import { RootState, useRootSelector } from 'store'
import { AccountsState } from 'store/accounts.reducer'

export const useAccounts = () => {
  const accounts = useRootSelector((state: RootState) => state.accounts)
  return accounts
}

export const useAccountSelector = <T>(
  selector: (accounts: AccountsState) => T,
) => {
  const data = useRootSelector((state: RootState) => selector(state.accounts))
  return data
}
