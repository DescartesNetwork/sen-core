import { declareDeprecated } from 'decorators/deprecated.decorator'
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
  declareDeprecated({ memberName: 'withWallet', deadline: 'Senhub v4' })
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
  const WrappedHOC = forwardRef<HTMLElement, any>((props, ref) => (
    <HOC {...props} ref={ref} />
  ))
  WrappedHOC.displayName = 'WithWallet'
  return WrappedHOC
}

/**
 * Wallet Hook
 */
export const useWallet = () => {
  declareDeprecated({ memberName: 'useWallet', deadline: 'Senhub v4' })
  return useContext<WalletProvider>(Context)
}
