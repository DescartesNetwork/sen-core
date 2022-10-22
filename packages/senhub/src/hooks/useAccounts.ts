import { RootState, useRootSelector } from 'store'
import { AccountsState } from 'store/accounts.reducer'

export const useAccounts = () => {
  const accounts = useRootSelector(({ accounts }: RootState) => accounts)
  return accounts
}

export const useAccountSelector = <T>(
  selector: (accounts: AccountsState) => T,
) => {
  const data = useRootSelector(({ accounts }: RootState) => selector(accounts))
  return data
}
