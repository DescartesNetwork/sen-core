import { RootState, useRootSelector } from 'store'

export const useNotificationPagination = () => {
  const notificationPagination = useRootSelector(
    (state: RootState) => state.notificationPagination,
  )
  return notificationPagination
}
