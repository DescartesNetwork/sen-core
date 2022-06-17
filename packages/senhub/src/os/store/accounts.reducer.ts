import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { account, AccountData } from '@senswap/sen-js'

/**
 * Interface & Utility
 */

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
    if (!account.isAddress(owner))
      throw new Error('Invalid owner/wallet address')
    const { splt } = window.sentre
    const ownerPublicKey = account.fromAddress(owner)
    const { value } = await splt.connection.getTokenAccountsByOwner(
      ownerPublicKey,
      { programId: splt.spltProgramId },
    )
    let bulk: AccountsState = {}
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
  if (!account.isAddress(address)) throw new Error('Invalid account address')
  const {
    accounts: { [address]: data },
  } = getState()
  if (data) return { [address]: data }
  const { splt } = window.sentre
  const raw = await splt.getAccountData(address)
  return { [address]: raw }
})

export const upsetAccount = createAsyncThunk<
  AccountsState,
  { address: string; data: AccountData },
  { state: any }
>(`${NAME}/upsetAccount`, async ({ address, data }) => {
  if (!account.isAddress(address)) throw new Error('Invalid address')
  if (!data) throw new Error('Data is empty')
  return { [address]: data }
})

export const deleteAccount = createAsyncThunk(
  `${NAME}/deleteAccount`,
  async ({ address }: { address: string }) => {
    if (!account.isAddress(address)) throw new Error('Invalid address')
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
