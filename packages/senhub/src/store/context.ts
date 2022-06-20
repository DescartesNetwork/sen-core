import { createContext } from 'react'
import { ReactReduxContextValue } from 'react-redux'

/**
 * Root context
 */

export const RootContext = createContext<ReactReduxContextValue>(null as any)
