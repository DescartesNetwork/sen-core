import { useRouteMatch } from 'react-router-dom'

import { RootState, useRootSelector } from 'store'

export const useAppIds = () => {
  const appIds = useRootSelector((state: RootState) => state.page.appIds)
  return appIds
}

export const useCurrentAppId = () => {
  const {
    params: { appId },
  } = useRouteMatch<{ appId: string }>('/app/:appId') || { params: {} }
  return appId
}
