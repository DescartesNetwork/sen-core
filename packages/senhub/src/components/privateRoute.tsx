import { ComponentProps, ElementType, useCallback } from 'react'
import { Route, Redirect } from 'react-router-dom'

import { isAddress } from 'shared/util'
import { useWalletAddress } from 'hooks/useWallet'
import { useAutoInstall } from 'hooks/useInstallApp'

export type PrivateRouteProps = {
  component: ElementType
} & ComponentProps<typeof Route>

const PrivateRoute = ({ component: Component, ...rest }: PrivateRouteProps) => {
  const walletAddress = useWalletAddress()
  const autoInstall = useAutoInstall()

  const render = useCallback(
    (props) => {
      const pathname = encodeURIComponent(
        window.location.href.replace(window.location.origin, ''),
      )
      const redirect = `?redirect=${pathname}`
      const guest = autoInstall ? '&guestMode=true' : ''
      if (!isAddress(walletAddress))
        return <Redirect to={`/welcome${redirect}${guest}`} />
      return <Component {...props} />
    },
    [walletAddress, autoInstall, Component],
  )

  return <Route {...rest} render={render} />
}

export default PrivateRoute
