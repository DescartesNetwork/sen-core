import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { PublicKey } from '@solana/web3.js'
import { OAuth } from '@sentre/connector'
import axios from 'axios'

import PDB from 'shared/pdb'
import { env } from 'shared/runtime'
import { isAddress } from 'shared/util'
import configs from 'configs'

const {
  api,
  register: { devAppId },
} = configs

const troubleshoot = (register: SenReg, appIds?: AppIds): AppIds => {
  if (!appIds || !Array.isArray(appIds)) return []
  const nextAppIds = [...appIds]
  if (env === 'development' && !nextAppIds.includes(devAppId))
    nextAppIds.unshift(devAppId)
  return nextAppIds.filter((appId) => register[appId]) || []
}

const validateSession = async (walletAddress: string) => {
  try {
    const {
      data: { walletAddress: expectedWalletAddress },
    } = await axios.get(api.user.index, {
      withCredentials: true,
    })
    if (expectedWalletAddress !== walletAddress) return false
    return true
  } catch (er: any) {
    return false
  }
}

const getUser = async (register: SenReg) => {
  const { data: user } = await axios.get<UserState>(api.user.index, {
    withCredentials: true,
  })
  return { ...user, appIds: troubleshoot(register, user.appIds) }
}

const updateUser = async (
  prevUser: Partial<UserState>,
  nextUser: Partial<UserState>,
) => {
  const user = { ...prevUser, ...nextUser }
  const { data } = await axios.post(api.user.index, user, {
    withCredentials: true,
  })
  return data
}

/**
 * Interface & Utility
 */

export type UserState = {
  _id: string
  walletAddress: string
  nftAddress: string
  snsAddress: string
  appIds: string[]
  developerMode: boolean
  createdAt: number
  updatedAt: number
  isAdmin: boolean
}

/**
 * Store constructor
 */

const NAME = 'user'
const initialState: UserState = {
  _id: '',
  walletAddress: '',
  nftAddress: '',
  snsAddress: '',
  appIds: [],
  developerMode: false,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  isAdmin: false,
}

/**
 * Actions
 */

export const login = createAsyncThunk<UserState, void, { state: any }>(
  `${NAME}/login`,
  async (_, { getState }) => {
    const {
      register,
      wallet: { address: walletAddress },
    } = getState()
    if (!isAddress(walletAddress))
      throw new Error('Wallet is not connected yet')

    // Check the current session
    const auth = await validateSession(walletAddress)
    // Login
    if (!auth) {
      const jst = OAuth.issue('hub.sentre.io')
      const bearer = await OAuth.sign(jst, {
        getPublicKey: async () => {
          const address = await window.sentre.solana.getAddress()
          return new PublicKey(address)
        },
        signMessage: async (msg: Buffer) => {
          const { signature } = await window.sentre.solana.signMessage(
            msg.toString('utf8'),
          )
          return Buffer.from(signature, 'hex')
        },
      })
      await axios.get(api.user.login, {
        headers: {
          authorization: `Bearer ${bearer}`,
        },
        withCredentials: true,
      })
    }
    // Get user
    const user = await getUser(register)
    return user
  },
)

export const logout = createAsyncThunk(`${NAME}/logout`, async () => {
  // Logout
  await axios.get(api.user.logout, { withCredentials: true })
  return { ...initialState }
})

export const upsetUser = createAsyncThunk<
  UserState,
  Partial<UserState>,
  { state: any }
>(`${NAME}/upsetUser`, async (user, { getState }) => {
  const { user: prevUser } = getState()
  const newUser = await updateUser(prevUser, user)
  return newUser
})

export const deleteUser = createAsyncThunk(`${NAME}/deleteUser`, async () => {
  await axios.delete(api.user.index, { withCredentials: true })
  return { ...initialState }
})

/**
 * Convenient AppIds Actions
 */

export const updateAppIds = createAsyncThunk<
  Partial<UserState>,
  AppIds,
  { state: any }
>(`${NAME}/updateAppIds`, async (appIds, { getState }) => {
  const {
    user: prevUser,
    wallet: { address: walletAddress },
    register,
  } = getState()
  if (!isAddress(walletAddress)) throw new Error('Wallet is not connected yet')
  const nextAppIds = troubleshoot(register, appIds)
  updateUser(prevUser, { appIds: nextAppIds }) // Async call for better ux
  return { appIds: nextAppIds }
})

export const installApp = createAsyncThunk<
  Partial<UserState>,
  string,
  { state: any }
>(`${NAME}/installApp`, async (appId, { getState }) => {
  const {
    user: { appIds, ...prevUser },
    wallet: { address: walletAddress },
  } = getState()
  if (!isAddress(walletAddress)) throw new Error('Wallet is not connected yet')
  if (appIds.includes(appId)) return { appIds }
  const nextAppIds: AppIds = [...appIds]
  nextAppIds.push(appId)
  updateUser(prevUser, { appIds: nextAppIds }) // Async call for better ux
  return { appIds: nextAppIds }
})

export const uninstallApp = createAsyncThunk<
  Partial<UserState>,
  string,
  { state: any }
>(`${NAME}/uninstallApp`, async (appId, { getState }) => {
  const {
    user: { appIds, ...prevUser },
    wallet: { address: walletAddress },
  } = getState()
  if (!isAddress(walletAddress)) throw new Error('Wallet is not connected yet')
  if (!appIds.includes(appId)) return { appIds }
  const nextAppIds = appIds.filter((id: string) => id !== appId)
  updateUser(prevUser, { appIds: nextAppIds }) // Async call for better ux
  const pdb = new PDB(walletAddress)
  await pdb.dropInstance(appId)
  return { appIds: nextAppIds }
})

/**
 * Convenient Developer Mode Actions
 */

export const updateDeveloperMode = createAsyncThunk<
  Partial<UserState>,
  boolean,
  { state: any }
>(`${NAME}/updateDeveloperMode`, async (developerMode, { getState }) => {
  const {
    user: prevUser,
    wallet: { address: walletAddress },
  } = getState()
  if (!isAddress(walletAddress)) throw new Error('Wallet is not connected yet')
  updateUser(prevUser, { developerMode }) // Async call for better ux
  return { developerMode }
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
        login.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        logout.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        upsetUser.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        deleteUser.fulfilled,
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
        updateDeveloperMode.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
