import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { PublicKey } from '@solana/web3.js'
import { OAuth } from '@sentre/connector'
import axios from 'axios'

import { isAddress } from 'shared/util'
import configs from 'configs'

const { api } = configs

/**
 * Interface & Utility
 */

export type UserState = {
  _id: string
  walletAddress: string
  nftAddress: string
  snsAddress: string
  appIds: string[]
  createdAt: number
  updatedAt: number
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
  createdAt: Date.now(),
  updatedAt: Date.now(),
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

/**
 * Actions
 */

export const login = createAsyncThunk<UserState, AppIds, { state: any }>(
  `${NAME}/login`,
  async (appIds, { getState }) => {
    const {
      wallet: { address: walletAddress },
    } = getState()
    if (!isAddress(walletAddress)) throw new Error('Invalid wallet address')

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
    // Sync user's data
    const { data: user } = await axios.post(
      api.user.index,
      {
        appIds,
      },
      {
        withCredentials: true,
      },
    )
    return user
  },
)

export const logout = createAsyncThunk(`${NAME}/logout`, async () => {
  // Logout
  await axios.get(api.user.logout, { withCredentials: true })
  return { ...initialState }
})

export const getUser = createAsyncThunk<UserState, void, { state: any }>(
  `${NAME}/getUser`,
  async (_, { getState }) => {
    const {
      user: prevUser,
      wallet: { address },
    } = getState()
    if (!isAddress(address)) throw new Error('Invalid wallet address')
    const { data: user } = !isAddress(prevUser.walletAddress)
      ? await axios.get(api.user.index, { withCredentials: true })
      : { data: prevUser }
    return user
  },
)

export const upsetUser = createAsyncThunk<
  UserState,
  Partial<UserState>,
  { state: any }
>(`${NAME}/upsetUser`, async (user, { getState }) => {
  const { user: prevUser } = getState()
  const data = { ...prevUser, ...user }
  const { data: newUser } = await axios.post(api.user.index, data, {
    withCredentials: true,
  })

  return { ...newUser }
})

export const deleteUser = createAsyncThunk(`${NAME}/deleteUser`, async () => {
  await axios.delete(api.user.index, { withCredentials: true })
  return { ...initialState }
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
        getUser.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        upsetUser.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        deleteUser.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
