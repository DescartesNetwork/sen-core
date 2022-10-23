import { ComponentProps, ElementType, useCallback } from 'react'
import { Route, Redirect } from 'react-router-dom'

import { useUser } from 'hooks/useUser'

export type PrivateRouteProps = {
  component: ElementType
} & ComponentProps<typeof Route>

const AdminRoute = ({ component: Component, ...rest }: PrivateRouteProps) => {
  const user = useUser()

  const render = useCallback(
    (props) => {
      const pathname = encodeURIComponent(
        window.location.href.replace(window.location.origin, ''),
      )
      if (user.isAdmin)
        return (
          <Redirect to={'/welcome?redirect=' + encodeURIComponent(pathname)} />
        )
      return <Component {...props} />
    },
    [Component, user.isAdmin],
  )

  return <Route {...rest} render={render} />
}

export default AdminRoute
