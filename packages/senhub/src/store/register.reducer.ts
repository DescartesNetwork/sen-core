import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import configs from 'configs'
import { isAddress } from 'shared/util'

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

export type RegisterState = SenReg

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

// For sandbox only
export const installManifest = createAsyncThunk<
  RegisterState,
  DAppManifest,
  { state: any }
>(`${NAME}/installManifest`, async (manifest, { getState }) => {
  const {
    wallet: { address: walletAddress },
    register,
    page,
  } = getState()
  if (!isAddress(walletAddress)) throw new Error('Wallet is not connected yet.')
  if (page.includes(manifest.appId))
    throw new Error('Cannot run sandbox for an installed application.')
  const newRegister: RegisterState = { ...register }
  newRegister[manifest.appId] = manifest
  return newRegister
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
      .addCase(
        loadRegister.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        installManifest.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
