import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'

import {
  useRootDispatch,
  useRootSelector,
  RootDispatch,
  RootState,
} from 'store'
import { setVisibleActionCenter, setVisibleInstaller } from 'store/ui.reducer'
import { setVisible } from 'store/search.reducer'

export type GoToAppProps = {
  appId?: string
  blank?: boolean
  search?: string
}

export const useGoToAppCallback = () => {
  const history = useHistory()
  const dispatch = useRootDispatch<RootDispatch>()
  const visible = useRootSelector((state: RootState) => state.search.visible)
  const visibleActionCenter = useRootSelector(
    (state: RootState) => state.ui.visibleActionCenter,
  )
  const visibleInstaller = useRootSelector(
    (state: RootState) => state.ui.visibleInstaller,
  )

  const onGotoAppCallback = useCallback(
    async ({ appId, blank = false, search }: GoToAppProps = {}) => {
      if (visible) await dispatch(setVisible(false))
      if (visibleActionCenter) await dispatch(setVisibleActionCenter(false))
      if (visibleInstaller) await dispatch(setVisibleInstaller(false))
      const nav = blank
        ? (url: string) => window.open(url, '_blank')
        : history.push
      let url = appId ? `/app/${appId}` : '/app'
      url = search ? url + search : url
      return nav(url)
    },
    [dispatch, history, visible, visibleActionCenter, visibleInstaller],
  )

  return onGotoAppCallback
}

export const useGoToApp = ({
  appId,
  blank = false,
  search,
}: GoToAppProps = {}) => {
  const onGotoAppCallback = useGoToAppCallback()
  const onGotoApp = useCallback(async () => {
    return onGotoAppCallback({ appId, blank, search })
  }, [onGotoAppCallback, appId, blank, search])

  return onGotoApp
}
