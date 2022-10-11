import { web3 } from '@project-serum/anchor'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { rpc } from 'shared/runtime'
import { GuestWallet } from 'view/wallet/lib'

/**
 * Interface & Utility
 */

export type WalletState = {
  visible: boolean
  address: string
  lamports: number
}

export const connection = new web3.Connection(rpc, { commitment: 'confirmed' })

const initializeWindow = (wallet?: WalletInterface) => {
  window.sentre = {
    solana: wallet || new GuestWallet(),
  }
}

const destroyWindow = async () => {
  if (window.sentre?.solana) window.sentre.solana.disconnect()
  initializeWindow()
}

/**
 * Store constructor
 */

const NAME = 'wallet'
const initialState: WalletState = {
  visible: false,
  address: '',
  lamports: 0,
}

/**
 * Actions
 */

export const openWallet = createAsyncThunk(`${NAME}/openWallet`, async () => {
  return { visible: true }
})

export const closeWallet = createAsyncThunk(`${NAME}/closeWallet`, async () => {
  return { visible: false }
})

export const connectWallet = createAsyncThunk(
  `${NAME}/connectWallet`,
  async (wallet: WalletInterface) => {
    if (!wallet) throw new Error('Invalid wallet instance')
    await initializeWindow(wallet)
    const address = await wallet.getAddress()
    wallet.publicKey = new web3.PublicKey(address)
    const lamports = await connection.getBalance(wallet.publicKey)
    return { address, lamports, visible: false }
  },
)

export const updateWallet = createAsyncThunk(
  `${NAME}/updateWallet`,
  async ({ lamports }: Partial<WalletState>) => {
    return { lamports }
  },
)

export const disconnectWallet = createAsyncThunk(
  `${NAME}/disconnectWallet`,
  async () => {
    await destroyWindow()
    window.location.reload() // Reset all redux store
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
        openWallet.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        closeWallet.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        connectWallet.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        updateWallet.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        disconnectWallet.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
