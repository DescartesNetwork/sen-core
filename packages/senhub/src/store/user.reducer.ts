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
  walletAddress: '',
  nftAddress: '',
  snsAddress: '',
  appIds: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
}

const validateSession = async () => {
  try {
    const { data } = await axios.get(api.health.cookie, {
      withCredentials: true,
    })
    if (data !== 'OK') return false
    return true
  } catch (er: any) {
    return false
  }
}

/**
 * Actions
 */

export const authUser = createAsyncThunk<UserState, AppIds, { state: any }>(
  `${NAME}/authUser`,
  async (appIds, { getState }) => {
    const {
      wallet: { address: walletAddress },
    } = getState()
    if (!isAddress(walletAddress)) throw new Error('Invalid wallet address')

    // Check the current session
    const auth = await validateSession()
    // Login
    if (!auth) {
      const jst = OAuth.issue('hub.sentre.io')
      const bearer = await OAuth.sign(jst, {
        getPublicKey: async () => {
          const address = await window.sentre.wallet.getAddress()
          return new PublicKey(address)
        },
        signMessage: async (msg: Buffer) => {
          const { signature } = await window.sentre.wallet.signMessage(
            msg.toString('utf8'),
          )
          return Buffer.from(signature, 'hex')
        },
      })
      await axios.get(api.user.auth, {
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
  const data = { user: { ...prevUser, ...user } }
  const { data: newUser } = await axios.post(api.user.index, data, {
    withCredentials: true,
  })
  return newUser
})

export const deleteUser = createAsyncThunk(`${NAME}/deleteUser`, async () => {
  await axios.delete(api.user.index, { withCredentials: true })
  return {}
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
        authUser.fulfilled,
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
      .addCase(deleteUser.fulfilled, (state, { payload }) => void payload),
})

export default slice.reducer