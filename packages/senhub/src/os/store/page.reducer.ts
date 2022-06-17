import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { account } from '@senswap/sen-js'

import PDB from 'shared/pdb'
import configs from 'os/configs'
import { env } from 'shared/runtime'

const {
  register: { senreg, extra, devAppId },
} = configs

/**
 * Interface & Utility
 */

export type PageState = {
  register: SenReg
  appIds: AppIds
}

const troubleshoot = (register: SenReg, appIds?: AppIds): AppIds => {
  if (!appIds || !Array.isArray(appIds)) return []
  if (env === 'development' && !appIds.includes(devAppId))
    appIds.unshift(devAppId)
  return appIds.filter((appId) => register[appId])
}
const fetchRegister = async () => {
  try {
    const res = await fetch(senreg)
    return await res.json()
  } catch (er) {
    return {}
  }
}

/**
 * Store constructor
 */

const NAME = 'page'
const initialState: PageState = {
  register: {},
  appIds: [],
}

/**
 * Actions
 */

// Must fetch register at very first of the process
export const loadRegister = createAsyncThunk(
  `${NAME}/loadRegister`,
  async () => {
    const register = await fetchRegister()
    return { register: { ...register, ...extra } }
  },
)

// For sandbox only
export const installManifest = createAsyncThunk<
  Partial<PageState>,
  ComponentManifest,
  { state: any }
>(`${NAME}/installManifest`, async (manifest, { getState }) => {
  const {
    wallet: { address: walletAddress },
    page: { appIds, register },
  } = getState()
  if (!account.isAddress(walletAddress))
    throw new Error('Wallet is not connected yet.')
  if (appIds.includes(manifest.appId))
    throw new Error('Cannot run sandbox for an installed application.')
  const newAppIds: AppIds = [...appIds]
  newAppIds.push(manifest.appId)
  const newRegister: SenReg = { ...register }
  newRegister[manifest.appId] = manifest
  return { appIds: newAppIds, register: newRegister }
})

/**
 * App Actions
 */
export const loadPage = createAsyncThunk<
  Partial<PageState>,
  void,
  { state: any }
>(`${NAME}/loadPage`, async (_, { getState }) => {
  const {
    wallet: { address: walletAddress },
    page: { register },
  } = getState()

  if (!account.isAddress(walletAddress))
    throw new Error('Wallet is not connected yet.')
  // Fetch user's apps
  const db = new PDB(walletAddress).createInstance('sentre')
  const appIds = troubleshoot(
    register,
    (await db.getItem('appIds')) || initialState.appIds,
  )
  return { appIds }
})

export const updatePage = createAsyncThunk<
  Partial<PageState>,
  AppIds,
  { state: any }
>(`${NAME}/updatePage`, async (appIds, { getState }) => {
  const {
    wallet: { address: walletAddress },
    page: { register },
  } = getState()
  if (!account.isAddress(walletAddress))
    throw new Error('Wallet is not connected yet.')
  appIds = troubleshoot(register, appIds)
  const db = new PDB(walletAddress).createInstance('sentre')
  await db.setItem('appIds', appIds)
  return { appIds }
})

export const installApp = createAsyncThunk<
  Partial<PageState>,
  string,
  { state: any }
>(`${NAME}/installApp`, async (appId, { getState }) => {
  const {
    wallet: { address: walletAddress },
    page: { appIds },
  } = getState()
  if (!account.isAddress(walletAddress))
    throw new Error('Wallet is not connected yet.')
  if (appIds.includes(appId)) return {}
  const newAppIds: AppIds = [...appIds]
  newAppIds.push(appId)
  const db = new PDB(walletAddress).createInstance('sentre')
  await db.setItem('appIds', newAppIds)
  return { appIds: newAppIds }
})

export const uninstallApp = createAsyncThunk<
  Partial<PageState>,
  string,
  { state: any }
>(`${NAME}/uninstallApp`, async (appId, { getState }) => {
  const {
    wallet: { address: walletAddress },
    page: { appIds },
  } = getState()
  if (!account.isAddress(walletAddress))
    throw new Error('Wallet is not connected yet.')
  if (!appIds.includes(appId)) return {}
  const newAppIds = appIds.filter((_appId: string) => _appId !== appId)
  const pdb = new PDB(walletAddress)
  const db = pdb.createInstance('sentre')
  await db.setItem('appIds', newAppIds)
  await pdb.dropInstance(appId)
  return { appIds: newAppIds }
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
      )
      .addCase(
        loadPage.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        updatePage.fulfilled,
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
