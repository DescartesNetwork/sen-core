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
  useCallback,
} from 'react'

import { AntdProvider } from './antd.provider'

import {
  useRootSelector,
  RootState,
  useRootDispatch,
  RootDispatch,
} from 'store'
import {
  UIState,
  setBackground as _setBackground,
  Background,
} from 'store/ui.reducer'
import { ConfigProviderProps } from 'antd/lib/config-provider'

const Context = createContext<UIProvider>({} as UIProvider)

export type UIProvider = {
  ui: UIState
  setBackground: (
    ...args: Parameters<typeof _setBackground>
  ) => Promise<Partial<{ background: Background }>>
}

/**
 * UI Context Provider
 */
const UIContextProvider = ({
  children,
  appId,
  antd = false,
}: {
  children: ReactNode
  appId: string
  antd?: boolean | ConfigProviderProps
}) => {
  const dispatch = useRootDispatch<RootDispatch>()
  const ui = useRootSelector((state: RootState) => state.ui)
  const setBackground = useCallback(
    async (...args: Parameters<typeof _setBackground>) =>
      await dispatch(_setBackground(...args)).unwrap(),
    [dispatch],
  )
  const provider = useMemo(() => ({ ui, setBackground }), [ui, setBackground])

  return (
    <Context.Provider value={provider}>
      <AntdProvider appId={appId} {...(typeof antd === 'object' ? antd : {})}>
        {children}
      </AntdProvider>
    </Context.Provider>
  )
}
export default UIContextProvider

/**
 * UI Context Consumer
 */
const UIComsumer = ({ children }: { children: JSX.Element }) => {
  return (
    <Context.Consumer>
      {(value) =>
        Children.map(children, (child) => cloneElement(child, { ...value }))
      }
    </Context.Consumer>
  )
}

/**
 * UI HOC
 */
export const withUI = (WrappedComponent: typeof Component) => {
  declareDeprecated({ memberName: 'withUI', deadline: 'Senhub v4' })
  class HOC extends Component<any, any> {
    render() {
      const { forwardedRef, ...rest } = this.props
      return (
        <UIComsumer>
          <WrappedComponent ref={forwardedRef} {...rest} />
        </UIComsumer>
      )
    }
  }
  const WrappedHOC = forwardRef<HTMLElement, any>((props, ref) => (
    <HOC {...props} ref={ref} />
  ))
  WrappedHOC.displayName = 'WithUI'
  return WrappedHOC
}

/**
 * UI Hook
 */
export const useUI = () => {
  declareDeprecated({ memberName: 'useUI', deadline: 'Senhub v4' })
  return useContext<UIProvider>(Context)
}
