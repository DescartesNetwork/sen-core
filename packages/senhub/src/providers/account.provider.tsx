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
import { AccountsState } from 'store/accounts.reducer'

const Context = createContext<AccountProvider>({} as AccountProvider)

export type AccountProvider = {
  accounts: AccountsState
}

/**
 * Account Context Provider
 */
const AccountContextProvider = ({ children }: { children: ReactNode }) => {
  const accounts = useRootSelector((state: RootState) => state.accounts)
  const provider = useMemo(() => ({ accounts }), [accounts])
  return <Context.Provider value={provider}>{children}</Context.Provider>
}
export default AccountContextProvider

/**
 * Account Context Consumer
 */
const AccountContextComsumer = ({ children }: { children: JSX.Element }) => {
  return (
    <Context.Consumer>
      {(value) =>
        Children.map(children, (child) => cloneElement(child, { ...value }))
      }
    </Context.Consumer>
  )
}

/**
 * Account HOC
 */
export const withAccount = (WrappedComponent: typeof Component) => {
  declareDeprecated({ memberName: 'withAccount', deadline: 'Senhub v4' })
  class HOC extends Component<any, any> {
    render() {
      const { forwardedRef, ...rest } = this.props
      return (
        <AccountContextComsumer>
          <WrappedComponent ref={forwardedRef} {...rest} />
        </AccountContextComsumer>
      )
    }
  }
  const WrappedHOC = forwardRef<HTMLElement, any>((props, ref) => (
    <HOC {...props} ref={ref} />
  ))
  WrappedHOC.displayName = 'WithAccount'
  return WrappedHOC
}

/**
 * Account Hook
 */
export const useAccount = () => {
  declareDeprecated({ memberName: 'useAccount', deadline: 'Senhub v4' })
  return useContext<AccountProvider>(Context)
}
