import { ComponentProps, ElementType, useCallback, useEffect } from 'react'
import { Route, Redirect } from 'react-router-dom'

import { isAddress } from 'shared/util'
import { useWalletAddress } from 'hooks/useWallet'

export type PrivateRouteProps = {
  component: ElementType
} & ComponentProps<typeof Route>

const PrivateRoute = ({ component: Component, ...rest }: PrivateRouteProps) => {
  const walletAddress = useWalletAddress()

  const render = useCallback(
    (props) => {
      const pathname = encodeURIComponent(
        window.location.href.replace(window.location.origin, ''),
      )
      if (!isAddress(walletAddress))
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
