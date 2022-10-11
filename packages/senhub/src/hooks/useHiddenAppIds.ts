import { RootState, useRootSelector } from 'store'

export const useHiddenAppIds = () => {
  const hiddenAppIds = useRootSelector(
    (state: RootState) => state.page.hiddenAppIds,
  )
  return hiddenAppIds
}
