import { useCallback } from 'react'

import { REGISTER_APP_STORE } from 'view/marketplace'
import { useRegister } from './useRegister'

export const useAppName = () => {
  const manifest = useRegister()

  const getAppName = useCallback(
    (appId: string) => {
      const { name } = manifest[appId] ||
        REGISTER_APP_STORE[appId] || { name: 'Unknown' }
      return name
    },
    [manifest],
  )

  return getAppName
}
