import {
  createDispatchHook,
  createSelectorHook,
  createStoreHook,
  useDispatch,
  useSelector,
} from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { RootContext } from 'store/context'
import { devTools, bigintSerializationMiddleware } from 'store/devTools'

import ui from './ui.reducer'
import flags from './flags.reducer'
import register from './register.reducer'
import page from './page.reducer'
import wallet from './wallet.reducer'
import user from './user.reducer'
import accounts from './accounts.reducer'
import mints from './mints.reducer'
import search from './search.reducer'
import notifications from './notifications.reducer'

/**
 * Root types
 */
export type RootState = ReturnType<typeof store.getState>
export type RootDispatch = typeof store.dispatch

/**
 * Root hooks
 */
export const useRootStore = createStoreHook(RootContext)
export const useRootDispatch: typeof useDispatch =
  createDispatchHook(RootContext)
export const useRootSelector: typeof useSelector =
  createSelectorHook(RootContext)

/**
 * Root store
 */
const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(bigintSerializationMiddleware),
  devTools: devTools('sentre'),
  reducer: {
    ui,
    flags,
    register,
    page,
    wallet,
    user,
    accounts,
    mints,
    search,
    notifications,
  },
})

export default store
