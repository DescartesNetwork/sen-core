import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { account } from '@senswap/sen-js'

import PDB from 'shared/pdb'

/**
 * Interface & Utility
 */

type FlagsState = {
  visited: boolean
  loading: boolean
}

/**
 * Store constructor
 */

const NAME = 'flags'
const initialState: FlagsState = {
  visited: true,
  loading: true,
}

/**
 * Actions
 */

export const loadVisited = createAsyncThunk<
  Partial<FlagsState>,
  void,
  { state: any }
>(`${NAME}/loadVisited`, async (_, { getState }) => {
  const {
    wallet: { address: walletAddress },
  } = getState()
  if (!account.isAddress(walletAddress))
    throw new Error('Wallet is not connected yet')
  const db = new PDB(walletAddress).createInstance('sentre')
  const visited: boolean = (await db.getItem('visited')) || false
  return { visited }
})

export const updateVisited = createAsyncThunk<
  Partial<FlagsState>,
  boolean,
  { state: any }
>(`${NAME}/updateVisited`, async (visited, { getState }) => {
  const {
    wallet: { address },
  } = getState()
  if (!account.isAddress(address))
    throw new Error('Wallet is not connected yet')
  const db = new PDB(address).createInstance('sentre')
  await db.setItem('visited', visited)
  return { visited }
})

export const updateLoading = createAsyncThunk(
  `${NAME}/updateLoading`,
  async (loading: boolean) => {
    return { loading }
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
        loadVisited.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        updateVisited.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        updateLoading.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
