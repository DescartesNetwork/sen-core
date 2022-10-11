import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { isAddress } from 'shared/util'
import { splt } from 'providers/sol.provider'

/**
 * Interface & Utility
 */

export type MintData = {
  mint_authority_option: number
  mint_authority: string
  supply: bigint
  decimals: number
  is_initialized: boolean
  freeze_authority_option: number
  freeze_authority: string
}
export type MintsState = Record<string, MintData>

/**
 * Store constructor
 */

const NAME = 'mints'
const initialState: MintsState = {}

/**
 * Actions
 */

export const getMint = createAsyncThunk<
  MintsState,
  { address: string; force?: boolean },
  { state: any }
>(`${NAME}/getMint`, async ({ address, force = false }, { getState }) => {
  if (!isAddress(address)) throw new Error('Invalid mint address')
  if (!force) {
    const {
      mints: { [address]: data },
    } = getState()
    if (data) return { [address]: data }
  }
  const raw = await splt.getMintData(address)
  return { [address]: raw }
})

export const upsetMint = createAsyncThunk<
  MintsState,
  { address: string; data: MintData },
  { state: any }
>(`${NAME}/upsetMint`, async ({ address, data }) => {
  if (!isAddress(address)) throw new Error('Invalid address')
  if (!data) throw new Error('Data is empty')
  return { [address]: data }
})

export const deleteMint = createAsyncThunk(
  `${NAME}/deleteMint`,
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
      .addCase(
        getMint.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        upsetMint.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        deleteMint.fulfilled,
        (state, { payload }) => void delete state[payload.address],
      ),
})

export default slice.reducer
