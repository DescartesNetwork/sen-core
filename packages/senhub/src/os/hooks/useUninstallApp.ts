import { useCallback } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import { RootDispatch, useRootDispatch } from 'os/store'
import { uninstallApp } from 'os/store/page.reducer'

export const useUninstallAppCallback = () => {
  const history = useHistory()
  const dispatch = useRootDispatch<RootDispatch>()
  const { pathname } = useLocation()

  const onUninstallCallback = useCallback(
    async (appId: string) => {
      await dispatch(uninstallApp(appId))
      if (!pathname.startsWith(`/app/${appId}`)) return
      return history.push('/welcome')
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
