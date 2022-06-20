import {
  createContext,
  useContext,
  Children,
  cloneElement,
  Component,
  forwardRef,
  ReactNode,
  useMemo,
} from 'react'

import { useRootSelector, RootState } from 'store'
import { WalletState } from 'store/wallet.reducer'

const Context = createContext<WalletProvider>({} as WalletProvider)

export type WalletProvider = {
  wallet: WalletState
}

/**
 * Wallet Context Provider
 */
const WalletContextProvider = ({ children }: { children: ReactNode }) => {
  const wallet = useRootSelector((state: RootState) => state.wallet)
  const provider = useMemo(() => ({ wallet }), [wallet])
  return <Context.Provider value={provider}>{children}</Context.Provider>
}
export default WalletContextProvider

/**
 * Wallet Context Consumer
 */
const WalletContextComsumer = ({ children }: { children: JSX.Element }) => {
  return (
    <Context.Consumer>
      {(value) =>
        Children.map(children, (child) => cloneElement(child, { ...value }))
      }
    </Context.Consumer>
  )
}

/**
 * Wallet HOC
 */
export const withWallet = (WrappedComponent: typeof Component) => {
  class HOC extends Component<any, any> {
    render() {
      const { forwardedRef, ...rest } = this.props
      return (
        <WalletContextComsumer>
          <WrappedComponent ref={forwardedRef} {...rest} />
        </WalletContextComsumer>
      )
    }
  }
  return forwardRef<HTMLElement, any>((props, ref) => (
    <HOC {...props} ref={ref} />
  ))
}

/**
 * Wallet Hook
 */
export const useWallet = () => {
  return useContext<WalletProvider>(Context)
}
