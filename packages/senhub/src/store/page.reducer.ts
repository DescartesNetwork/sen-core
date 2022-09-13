import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import PDB from 'shared/pdb'
import { env } from 'shared/runtime'
import { isAddress } from 'shared/util'
import configs from 'configs'

const {
  register: { devAppId },
} = configs

/**
 * Interface & Utility
 */

export type PageState = AppIds

const troubleshoot = (register: SenReg, appIds?: AppIds): AppIds => {
  if (!appIds || !Array.isArray(appIds)) return []
  if (env === 'development' && !appIds.includes(devAppId))
    appIds.unshift(devAppId)
  return appIds.filter((appId) => register[appId])
}

/**
 * Store constructor
 */

const NAME = 'page'
const initialState: PageState = []

/**
 * Actions
 */

/**
 * App Actions
 */

export const loadPage = createAsyncThunk<PageState, void, { state: any }>(
  `${NAME}/loadPage`,
  async (_, { getState }) => {
    const {
      wallet: { address: walletAddress },
      register,
    } = getState()
    if (!isAddress(walletAddress))
      throw new Error('Wallet is not connected yet.')
    // Fetch user's apps
    const db = new PDB(walletAddress).createInstance('sentre')
    const page = (await db.getItem<AppIds>('appIds')) || initialState
    const appIds = troubleshoot(register, page)
    return appIds
  },
)

export const updatePage = createAsyncThunk<PageState, AppIds, { state: any }>(
  `${NAME}/updatePage`,
  async (appIds, { getState }) => {
    const {
      wallet: { address: walletAddress },
      register,
    } = getState()
    if (!isAddress(walletAddress))
      throw new Error('Wallet is not connected yet.')
    appIds = troubleshoot(register, appIds)
    const db = new PDB(walletAddress).createInstance('sentre')
    await db.setItem<AppIds>('appIds', appIds)
    return appIds
  },
)

export const installApp = createAsyncThunk<PageState, string, { state: any }>(
  `${NAME}/installApp`,
  async (appId, { getState }) => {
    const {
      wallet: { address: walletAddress },
      page,
    } = getState()
    if (!isAddress(walletAddress))
      throw new Error('Wallet is not connected yet.')
    if (page.includes(appId)) return page
    const appIds: PageState = [...page]
    appIds.push(appId)
    const db = new PDB(walletAddress).createInstance('sentre')
    await db.setItem<AppIds>('appIds', appIds)
    return appIds
  },
)

export const uninstallApp = createAsyncThunk<PageState, string, { state: any }>(
  `${NAME}/uninstallApp`,
  async (appId, { getState }) => {
    const {
      wallet: { address: walletAddress },
      page,
    } = getState()
    if (!isAddress(walletAddress))
      throw new Error('Wallet is not connected yet.')
    if (!page.includes(appId)) return page
    const appIds = page.filter((id: string) => id !== appId)
    const pdb = new PDB(walletAddress)
    const db = pdb.createInstance('sentre')
    await db.setItem<AppIds>('appIds', appIds)
    await pdb.dropInstance(appId)
    return appIds
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
      .addCase(loadPage.fulfilled, (state, { payload }) => payload)
      .addCase(updatePage.fulfilled, (state, { payload }) => payload)
      .addCase(installApp.fulfilled, (state, { payload }) => payload)
      .addCase(uninstallApp.fulfilled, (state, { payload }) => payload),
})

export default slice.reducer
