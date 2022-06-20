import { ComponentProps, ElementType, useCallback } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { account } from '@senswap/sen-js'

import { useRootSelector, RootState } from 'store'

export type PrivateRouteProps = {
  component: ElementType
} & ComponentProps<typeof Route>

const PrivateRoute = ({ component: Component, ...rest }: PrivateRouteProps) => {
  const walletAddress = useRootSelector(
    (state: RootState) => state.wallet.address,
  )

  const render = useCallback(
    (props) => {
      const pathname = encodeURIComponent(
        window.location.href.replace(window.location.origin, ''),
      )
      if (!account.isAddress(walletAddress))
        return (
          <Redirect to={'/welcome?redirect=' + encodeURIComponent(pathname)} />
        )
      return <Component {...props} />
    },
    [walletAddress, Component],
  )

  return <Route {...rest} render={render} />
}

export default PrivateRoute
