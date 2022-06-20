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

export type GoToStoreProps = {
  appId?: string
  blank?: boolean
  search?: string
}

export const useGoToStoreCallback = () => {
  const history = useHistory()
  const dispatch = useRootDispatch<RootDispatch>()
  const visible = useRootSelector((state: RootState) => state.search.visible)
  const visibleActionCenter = useRootSelector(
    (state: RootState) => state.ui.visibleActionCenter,
  )
  const visibleInstaller = useRootSelector(
    (state: RootState) => state.ui.visibleInstaller,
  )

  const onGotoStoreCallback = useCallback(
    async ({ appId, blank = false, search }: GoToStoreProps = {}) => {
      if (visible) await dispatch(setVisible(false))
      if (visibleActionCenter) await dispatch(setVisibleActionCenter(false))
      if (visibleInstaller) await dispatch(setVisibleInstaller(false))
      const nav = blank
        ? (url: string) => window.open(url, '_blank')
        : history.push
      let url = appId ? `/store/${appId}` : '/store'
      url = search ? url + search : url
      return nav(url)
    },
    [dispatch, history, visible, visibleActionCenter, visibleInstaller],
  )

  return onGotoStoreCallback
}

export const useGoToStore = ({
  appId,
  blank = false,
  search,
}: GoToStoreProps = {}) => {
  const onGotoStoreCallback = useGoToStoreCallback()
  const onGotoStore = useCallback(async () => {
    return onGotoStoreCallback({ appId, blank, search })
  }, [onGotoStoreCallback, appId, blank, search])

  return onGotoStore
}
