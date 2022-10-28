import { RootState, useRootSelector } from 'store'

export const useNotifications = () => {
  const notifications = useRootSelector(
    ({ notifications }: RootState) => notifications.notificationsData,
  )
  return notifications
}

export const useUserNotification = () => {
  const userNotification = useRootSelector(
    ({ notifications }: RootState) => notifications.userNotification,
  )
  return userNotification
}

export const useOffset = () => {
  const notifications = useRootSelector(
    ({ notifications }: RootState) => notifications.offset,
  )
  return notifications
}

export const useUnreadCount = () => {
  const notifications = useRootSelector(
    ({ notifications }: RootState) => notifications.unreadCount,
  )
  return notifications
}
