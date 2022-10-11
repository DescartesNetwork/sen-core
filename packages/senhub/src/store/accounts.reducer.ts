import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { PublicKey } from '@solana/web3.js'

import { isAddress } from 'shared/util'
import { splt } from './mints.reducer'

/**
 * Interface & Utility
 */

export type AccountData = {
  mint: string
  owner: string
  amount: bigint
  delegate_option: number
  delegate: string
  state: number
  is_native_option: number
  is_native: bigint
  delegated_amount: bigint
  close_authority_option: number
  close_authority: string
}
export type AccountsState = Record<string, AccountData>

/**
 * Store constructor
 */

const NAME = 'accounts'
const initialState: AccountsState = {}

/**
 * Actions
 */

export const getAccounts = createAsyncThunk(
  `${NAME}/getAccounts`,
  async ({ owner }: { owner: string }) => {
    if (!isAddress(owner)) throw new Error('Invalid owner/wallet address')
    const ownerPublicKey = new PublicKey(owner)
    const { value } = await splt.connection.getTokenAccountsByOwner(
      ownerPublicKey,
      { programId: splt.spltProgramId },
    )
    const bulk: AccountsState = {}
    value.forEach(({ pubkey, account: { data: buf } }) => {
      const address = pubkey.toBase58()
      const data = splt.parseAccountData(buf)
      return (bulk[address] = data)
    })
    return bulk
  },
)

export const getAccount = createAsyncThunk<
  AccountsState,
  { address: string },
  { state: any }
>(`${NAME}/getAccount`, async ({ address }, { getState }) => {
  if (!isAddress(address)) throw new Error('Invalid account address')
  const {
    accounts: { [address]: data },
  } = getState()
  if (data) return { [address]: data }
  const raw = await splt.getAccountData(address)
  return { [address]: raw }
})

export const upsetAccount = createAsyncThunk<
  AccountsState,
  { address: string; data: AccountData },
  { state: any }
>(`${NAME}/upsetAccount`, async ({ address, data }) => {
  if (!isAddress(address)) throw new Error('Invalid address')
  if (!data) throw new Error('Data is empty')
  return { [address]: data }
})

export const deleteAccount = createAsyncThunk(
  `${NAME}/deleteAccount`,
  async ({ address }: { address: string }) => {
    if (!isAddress(address)) throw new Error('Invalid address')
    return { address }
  },
)

/**
 * Usual procedure
 */

const slice = createSlice({
  name: NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    void builder
      .addCase(getAccounts.fulfilled, (state, { payload }) => payload)
      .addCase(
        getAccount.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        upsetAccount.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        deleteAccount.fulfilled,
        (state, { payload }) => void delete state[payload.address],
      ),
})

export default slice.reducer
