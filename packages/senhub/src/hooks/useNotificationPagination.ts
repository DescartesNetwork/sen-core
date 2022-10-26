import { RootState, useRootSelector } from 'store'

export const useNotificationPagination = () => {
  const notificationPagination = useRootSelector(
    ({ notifications: { pagination } }: RootState) => pagination,
  )
  return notificationPagination
}
