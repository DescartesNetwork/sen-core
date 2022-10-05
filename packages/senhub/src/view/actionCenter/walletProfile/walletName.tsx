import { useCallback, useEffect, useState } from 'react'
import { web3 } from '@project-serum/anchor'

import { Typography } from 'antd'

import { useWalletAddress } from 'hooks/useWallet'
import {
  RootDispatch,
  RootState,
  useRootDispatch,
  useRootSelector,
} from 'store'
import { upsetUser } from 'store/user.reducer'
import { performReverseLookup } from 'helper/sns/utils'
import { net } from 'shared/runtime'
import configs from 'configs'

const {
  sol: { rootDomainAccount, snsProgramId },
} = configs

const WalletName = () => {
  const [solName, setSolName] = useState('')
  const snsAddress = useRootSelector(
    (state: RootState) => state.user.snsAddress,
  )
  const walletAddress = useWalletAddress()
  const dispatch = useRootDispatch<RootDispatch>()

  const fetchDomainName = useCallback(async () => {
    if (snsAddress === '' || net === 'devnet') return
    if (snsAddress) {
      const name = await performReverseLookup(new web3.PublicKey(snsAddress))
      return setSolName(name)
    }

    const filters = [
      {
        memcmp: {
          offset: 32,
          bytes: walletAddress,
        },
      },
      {
        memcmp: {
          offset: 0,
          bytes: rootDomainAccount,
        },
      },
    ]
    const accountKeys = await window.sentre.splt.connection.getProgramAccounts(
      new web3.PublicKey(snsProgramId),
      {
        commitment: 'confirmed',
        filters,
      },
    )

    //Din't have any sns
    if (!accountKeys.length) return setSolName('')

    //Update snsAddress for user
    dispatch(upsetUser({ snsAddress: accountKeys[0].pubkey.toBase58() }))

    const name = await performReverseLookup(accountKeys[0].pubkey)
    return setSolName(name)
  }, [dispatch, snsAddress, walletAddress])

  useEffect(() => {
    fetchDomainName()
  }, [fetchDomainName])

  if (!solName) return null

  return (
    <Typography.Text style={{ color: '#F9575E' }}>{solName}</Typography.Text>
  )
}

export default WalletName
