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
const HIDDEN_APP_ID_KEY = 'hiddenAppIds'

/**
 * Interface & Utility
 */

export type PageState = {
  appIds: AppIds
  hiddenAppIds: AppIds
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
  hiddenAppIds: [],
}

/**
 * Actions
 */

/**
 * App Actions
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
    const nextAppIds =
      (await db.getItem<AppIds>(APP_ID_KEY)) || initialState.appIds
    const appIds = troubleshoot(register, nextAppIds)

    // Fetch hidden appIds
    const hiddenAppIds = (await db.getItem<AppIds>(HIDDEN_APP_ID_KEY)) || []
    return { appIds, hiddenAppIds }
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
  const nexAppIds = troubleshoot(register, appIds)
  const db = new PDB(walletAddress).createInstance(SENTRE_KEY)
  await db.setItem<AppIds>(APP_ID_KEY, nexAppIds)
  return { appIds: nexAppIds }
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
      page: { appIds, hiddenAppIds },
    } = getState()
    if (!isAddress(walletAddress))
      throw new Error('Wallet is not connected yet.')
    if (!appIds.includes(appId)) return appIds
    const nextAppIds = appIds.filter((id: string) => id !== appId)
    const nextHiddenAppIds = hiddenAppIds.filter((id: string) => id !== appId)
    const pdb = new PDB(walletAddress)
    const db = pdb.createInstance(SENTRE_KEY)
    await db.setItem<AppIds>(APP_ID_KEY, nextAppIds)
    await db.setItem<AppIds>(HIDDEN_APP_ID_KEY, nextHiddenAppIds)
    await pdb.dropInstance(appId)
    return { appIds: nextAppIds, hiddenAppIds: nextHiddenAppIds }
  },
)

export const setHiddenAppIds = createAsyncThunk<
  Partial<PageState>,
  AppIds,
  { state: any }
>(`${NAME}/setHiddenAppIds`, async (hiddenAppIds, { getState }) => {
  const {
    wallet: { address: walletAddress },
  } = getState()
  if (!isAddress(walletAddress)) throw new Error('Wallet is not connected yet.')

  const db = new PDB(walletAddress).createInstance(SENTRE_KEY)
  await db.setItem<AppIds>(HIDDEN_APP_ID_KEY, hiddenAppIds)

  return { hiddenAppIds }
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
      )
      .addCase(
        setHiddenAppIds.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
