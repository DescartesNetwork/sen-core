import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import PDB from 'shared/pdb'
import { env } from 'shared/runtime'
import { isAddress } from 'shared/util'
import configs from 'configs'

const {
  register: { devAppId },
} = configs

const SENTRE_KEY = 'sentre'
const APP_ID_KEY = 'appIds'

/**
 * Interface & Utility
 */

export type PageState = {
  appIds: AppIds
}

const troubleshoot = (register: SenReg, appIds?: AppIds): AppIds => {
  if (!appIds || !Array.isArray(appIds)) return []
  const nextAppIds = [...appIds]
  if (env === 'development' && !nextAppIds.includes(devAppId))
    nextAppIds.unshift(devAppId)
  return nextAppIds.filter((appId) => register[appId]) || []
}

/**
 * Store constructor
 */

const NAME = 'page'
const initialState: PageState = {
  appIds: [],
}

/**
 * Actions
 */

export const loadAppIds = createAsyncThunk<PageState, void, { state: any }>(
  `${NAME}/loadAppIds`,
  async (_, { getState }) => {
    const {
      wallet: { address: walletAddress },
      register,
    } = getState()
    if (!isAddress(walletAddress))
      throw new Error('Wallet is not connected yet.')
    // Fetch user's apps
    const db = new PDB(walletAddress).createInstance(SENTRE_KEY)
    const nextAppIds = (await db.getItem<AppIds>(APP_ID_KEY)) || []
    const appIds = troubleshoot(register, nextAppIds)
    return { appIds }
  },
)

export const updateAppIds = createAsyncThunk<
  Partial<PageState>,
  AppIds,
  { state: any }
>(`${NAME}/updateAppIds`, async (appIds, { getState }) => {
  const {
    wallet: { address: walletAddress },
    register,
  } = getState()
  if (!isAddress(walletAddress)) throw new Error('Wallet is not connected yet.')
  const nextAppIds = troubleshoot(register, appIds)
  const db = new PDB(walletAddress).createInstance(SENTRE_KEY)
  await db.setItem<AppIds>(APP_ID_KEY, nextAppIds)
  return { appIds: nextAppIds }
})

export const installApp = createAsyncThunk<PageState, string, { state: any }>(
  `${NAME}/installApp`,
  async (appId, { getState }) => {
    const {
      wallet: { address: walletAddress },
      page: { appIds },
    } = getState()
    if (!isAddress(walletAddress))
      throw new Error('Wallet is not connected yet.')
    if (appIds.includes(appId)) return appIds
    const nextAppIds: AppIds = [...appIds]
    nextAppIds.push(appId)

    const db = new PDB(walletAddress).createInstance(SENTRE_KEY)
    await db.setItem<AppIds>(APP_ID_KEY, nextAppIds)
    return { appIds: nextAppIds }
  },
)

export const uninstallApp = createAsyncThunk<PageState, string, { state: any }>(
  `${NAME}/uninstallApp`,
  async (appId, { getState }) => {
    const {
      wallet: { address: walletAddress },
      page: { appIds },
    } = getState()
    if (!isAddress(walletAddress))
      throw new Error('Wallet is not connected yet.')
    if (!appIds.includes(appId)) return appIds
    const nextAppIds = appIds.filter((id: string) => id !== appId)
    const pdb = new PDB(walletAddress)
    const db = pdb.createInstance(SENTRE_KEY)
    await db.setItem<AppIds>(APP_ID_KEY, nextAppIds)
    await pdb.dropInstance(appId)
    return { appIds: nextAppIds }
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
        loadAppIds.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        updateAppIds.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        installApp.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        uninstallApp.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
