import { useCallback, useEffect, useState } from 'react'

import {
  RootDispatch,
  RootState,
  useRootDispatch,
  useRootSelector,
} from 'store'
import { getAccount, AccountData } from 'store/accounts.reducer'
import { isAddress } from 'shared/util'
import { useWalletAddress } from './useWallet'

export const useAccounts = () => {
  const accounts = useRootSelector((state: RootState) => state.accounts)
  return accounts
}

export const useAccountData = (address: string) => {
  const accountData = useRootSelector(
    (state: RootState) => state.accounts[address],
  )
  return accountData
}

export const useAccountDataByMint = (
  mintAddress: string,
): AccountData | undefined => {
  const [accountAddress, setAccountAddress] = useState('')
  const walletAddress = useWalletAddress()
  const accountData = useAccountData(accountAddress)

  const getAccountAddress = useCallback(async () => {
    if (!isAddress(mintAddress)) return setAccountAddress('')
    const address = await window.sentre.splt.deriveAssociatedAddress(
      walletAddress,
      mintAddress,
    )
    return setAccountAddress(address)
  }, [mintAddress, walletAddress])

  useEffect(() => {
    getAccountAddress()
  }, [getAccountAddress])

  return accountData
}

export const useGetAccountDataByMint = (mintAddress: string) => {
  const dispatch = useRootDispatch<RootDispatch>()
  const walletAddress = useWalletAddress()

  const getAccountData = useCallback(async () => {
    if (!isAddress(mintAddress)) return undefined
    const address = await window.sentre.splt.deriveAssociatedAddress(
      walletAddress,
      mintAddress,
    )
    const accountData = await dispatch(getAccount({ address })).unwrap()
    return accountData
  }, [dispatch, mintAddress, walletAddress])

  return getAccountData
}
