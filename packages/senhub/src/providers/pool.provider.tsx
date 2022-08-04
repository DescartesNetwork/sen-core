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
  declareDeprecated({ memberName: 'withPool', deadline: 'Senhub v4' })
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
  const WrappedHOC = forwardRef<HTMLElement, any>((props, ref) => (
    <HOC {...props} ref={ref} />
  ))
  WrappedHOC.displayName = 'WithPool'
  return WrappedHOC
}

/**
 * Pool Hook
 */
export const usePool = () => {
  declareDeprecated({ memberName: 'usePool', deadline: 'Senhub v4' })
  return useContext<PoolProvider>(Context)
}
