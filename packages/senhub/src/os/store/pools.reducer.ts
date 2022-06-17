import { AccountInfo, PublicKey } from '@solana/web3.js'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { account, PoolData } from '@senswap/sen-js'
import configs from 'os/configs'

const {
  sol: { taxmanAddress },
} = configs

/**
 * Interface & Utility
 */

export type PoolsState = Record<string, PoolData>

/**
 * Store constructor
 */

const NAME = 'pools'
const initialState: PoolsState = {}

/**
 * Actions
 */

export const getPools = createAsyncThunk(`${NAME}/getPools`, async () => {
  const { swap } = window.sentre
  // Get all pools
  const value: Array<{ pubkey: PublicKey; account: AccountInfo<Buffer> }> =
    await swap.connection.getProgramAccounts(swap.swapProgramId, {
      filters: [
        { dataSize: 257 },
        { memcmp: { bytes: taxmanAddress, offset: 65 } },
      ],
    })
  let bulk: PoolsState = {}
  value.forEach(({ pubkey, account: { data: buf } }) => {
    const address = pubkey.toBase58()
    const data = swap.parsePoolData(buf)
    bulk[address] = data
  })
  return bulk
})

export const getPool = createAsyncThunk<
  PoolsState,
  { address: string },
  { state: any }
>(`${NAME}/getPool`, async ({ address }, { getState }) => {
  if (!account.isAddress(address)) throw new Error('Invalid pool address')
  const {
    pools: { [address]: data },
  } = getState()
  if (data) return { [address]: data }
  const { swap } = window.sentre
  const raw = await swap.getPoolData(address)
  return { [address]: raw }
})

export const upsetPool = createAsyncThunk<
  PoolsState,
  { address: string; data: PoolData },
  { state: any }
>(`${NAME}/upsetPool`, async ({ address, data }) => {
  if (!account.isAddress(address)) throw new Error('Invalid pool address')
  if (!data) throw new Error('Data is empty')
  return { [address]: data }
})

/**
 * Usual procedure
 */

const slice = createSlice({
  name: NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    void builder
      .addCase(getPools.fulfilled, (state, { payload }) => payload)
      .addCase(
        getPool.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        upsetPool.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
