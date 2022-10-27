import { RootState, useRootSelector } from 'store'

export const useUnreadNotificationCount = () => {
  const unreadCount = useRootSelector(
    ({ notifications: { unreadCount } }: RootState) => unreadCount,
  )
  return unreadCount
}
