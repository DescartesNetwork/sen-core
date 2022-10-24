import { ComponentProps, ElementType, useCallback } from 'react'
import { Route, Redirect } from 'react-router-dom'

import { useWalletAddress } from 'hooks/useWallet'
import configs from 'configs'

const { admin } = configs

export type PrivateRouteProps = {
  component: ElementType
} & ComponentProps<typeof Route>

const AdminRoute = ({ component: Component, ...rest }: PrivateRouteProps) => {
  const walletAddress = useWalletAddress()

  const render = useCallback(
    (props) => {
      const pathname = encodeURIComponent(
        window.location.href.replace(window.location.origin, ''),
      )
      console.log('patthname: ', pathname)
      console.log('admin.adminPubkeys: ', admin.adminAddresses)

      console.log('wallet address: ', walletAddress)
      const index = admin.adminAddresses.findIndex(
        (admin) => admin === walletAddress,
      )
      console.log('index: ', index)
      if (index < 0)
        return (
          <Redirect to={'/welcome?redirect=' + encodeURIComponent(pathname)} />
        )
      console.log('')
      return <Component {...props} />
    },
    [Component, walletAddress],
  )

  return <Route {...rest} render={render} />
}

export default AdminRoute
