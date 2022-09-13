import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import configs from 'configs'

const {
  register: { extra },
  api: { dapp },
} = configs

const fetchRegister = async (): Promise<DAppManifest[]> => {
  try {
    const res = await fetch(dapp.index)
    return await res.json()
  } catch (er) {
    return []
  }
}

/**
 * Interface & Utility
 */

export type RegisterState = Record<string, DAppManifest>

/**
 * Store constructor
 */

const NAME = 'register'
const initialState: RegisterState = {}

/**
 * Actions
 */

// Must fetch register at very first of the process
export const loadRegister = createAsyncThunk(
  `${NAME}/loadRegister`,
  async () => {
    const dapps = await fetchRegister()
    const register: RegisterState = {}
    dapps.forEach((dapp) => (register[dapp.appId] = dapp))
    return { ...register, ...extra }
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
    void builder.addCase(
      loadRegister.fulfilled,
      (state, { payload }) => void Object.assign(state, payload),
    ),
})

export default slice.reducer
