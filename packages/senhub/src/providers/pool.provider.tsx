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
import { PoolsState } from 'store/pools.reducer'

const Context = createContext<PoolProvider>({} as PoolProvider)

export type PoolProvider = {
  pools: PoolsState
}

/**
 * Pool Context Provider
 */
const PoolContextProvider = ({ children }: { children: ReactNode }) => {
  const pools = useRootSelector((state: RootState) => state.pools)
  const provider = useMemo(() => ({ pools }), [pools])
  return <Context.Provider value={provider}>{children}</Context.Provider>
}
export default PoolContextProvider

/**
 * Pool Context Consumer
 */
const PoolContextComsumer = ({ children }: { children: JSX.Element }) => {
  return (
    <Context.Consumer>
      {(value) =>
        Children.map(children, (child) => cloneElement(child, { ...value }))
      }
    </Context.Consumer>
  )
}

/**
 * Pool HOC
 */
export const withPool = (WrappedComponent: typeof Component) => {
  class HOC extends Component<any, any> {
    render() {
      const { forwardedRef, ...rest } = this.props
      return (
        <PoolContextComsumer>
          <WrappedComponent ref={forwardedRef} {...rest} />
        </PoolContextComsumer>
      )
    }
  }
  return forwardRef<HTMLElement, any>((props, ref) => (
    <HOC {...props} ref={ref} />
  ))
}

/**
 * Pool Hook
 */
export const usePool = () => {
  return useContext<PoolProvider>(Context)
}
