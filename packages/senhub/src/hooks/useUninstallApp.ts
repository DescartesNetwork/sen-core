import { useCallback } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import { RootDispatch, useRootDispatch } from 'store'
import { uninstallApp } from 'store/user.reducer'

export const useUninstallAppCallback = () => {
  const history = useHistory()
  const dispatch = useRootDispatch<RootDispatch>()
  const { pathname } = useLocation()

  const onUninstallCallback = useCallback(
    async (appId: string) => {
      await dispatch(uninstallApp(appId))
      if (pathname.startsWith(`/app/${appId}`)) return history.push('/welcome')
    },
    [dispatch, pathname, history],
  )

  return onUninstallCallback
}

export const useUninstallApp = (appId: string) => {
  const onUninstallCallback = useUninstallAppCallback()
  const onUninstallApp = useCallback(async () => {
    return onUninstallCallback(appId)
  }, [onUninstallCallback, appId])

  return onUninstallApp
}
