import { RootState, useRootSelector } from 'store'

export const useAppIds = () => {
  const appIds = useRootSelector((state: RootState) => state.page.appIds)
  return appIds
}
