import {
  createContext,
  useContext,
  Children,
  cloneElement,
  Component,
  forwardRef,
  ReactNode,
  useMemo,
  CSSProperties,
  useCallback,
} from 'react'

import { ConfigProvider } from 'antd'

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
  ) => Promise<{ background: Background }>
}

/**
 * UI Context Provider
 */
const UIContextProvider = ({
  children,
  appId,
  style = {},
  antd = false,
}: {
  children: ReactNode
  appId: string
  style?: CSSProperties
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
  const configProvider = antd
    ? {
        getPopupContainer: () => document.getElementById(appId) as HTMLElement,
        ...(typeof antd === 'object' ? antd : {}),
      }
    : undefined

  return (
    <Context.Provider value={provider}>
      <section id={appId} style={{ backgroundColor: 'transparent', ...style }}>
        {configProvider ? (
          <ConfigProvider {...configProvider}>{children}</ConfigProvider>
        ) : (
          children
        )}
      </section>
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
  return forwardRef<HTMLElement, any>((props, ref) => (
    <HOC {...props} ref={ref} />
  ))
}

/**
 * UI Hook
 */
export const useUI = () => {
  return useContext<UIProvider>(Context)
}
