import { useCallback, useEffect, useState } from 'react'
import { utils } from '@senswap/sen-js'

import { Avatar, Spin } from 'antd'

import { useAccounts } from 'hooks/useAccounts'
import { useGetMintDecimals } from 'hooks/useMints'
import { MetaplexProvider } from 'shared/tokenProvider'
import { useWalletAddress } from 'hooks/useWallet'
import {
  RootDispatch,
  RootState,
  useRootDispatch,
  useRootSelector,
} from 'store'
import { AccountData } from 'store/accounts.reducer'
import { upsetUser } from 'store/user.reducer'
import { net } from 'shared/runtime'

export type WalletAvatarProps = {
  avatarSize?: number
}

const WalletAvatar = ({ avatarSize = 32 }: WalletAvatarProps) => {
  const [avatar, setAvatar] = useState('')
  const [loading, setLoading] = useState(false)
  const accounts = useAccounts()
  const getMintDecimal = useGetMintDecimals()
  const walletAddress = useWalletAddress()
  const nftAddress = useRootSelector(
    (state: RootState) => state.user.nftAddress,
  )
  const dispatch = useRootDispatch<RootDispatch>()

  const fetchAvatar = useCallback(async () => {
    if (nftAddress === '' || net === 'devnet') return
    try {
      setLoading(true)
      const metaplex = new MetaplexProvider()
      const tokenInfo = await metaplex.findByAddress(nftAddress)
      if (tokenInfo && tokenInfo.logoURI) return setAvatar(tokenInfo.logoURI)

      const filteredAccount: AccountData[] = []
      for (const address in accounts) {
        const { amount, mint } = accounts[address]
        const decimal = (await getMintDecimal({ mintAddress: mint })) || 0
        if (utils.undecimalize(amount, decimal) !== '1' || decimal !== 0)
          continue
        filteredAccount.push(accounts[address])
      }
      for (const { mint } of filteredAccount) {
        const tokenInfo = await metaplex.findByAddress(mint)
        if (!tokenInfo || !tokenInfo.logoURI) continue
        const img = tokenInfo.logoURI

        //update user nftAddress
        dispatch(upsetUser({ nftAddress: mint }))

        return setAvatar(img)
      }

      return setAvatar('')
    } finally {
      setLoading(false)
    }
  }, [accounts, dispatch, getMintDecimal, nftAddress])

  useEffect(() => {
    fetchAvatar()
  }, [fetchAvatar])

  if (avatar)
    return (
      <Spin spinning={loading}>
        <Avatar src={avatar} size={avatarSize} />
      </Spin>
    )

  return (
    <Spin spinning={loading}>
      <Avatar size={avatarSize}>{walletAddress.substring(0, 2)}</Avatar>
    </Spin>
  )
}

export default WalletAvatar
