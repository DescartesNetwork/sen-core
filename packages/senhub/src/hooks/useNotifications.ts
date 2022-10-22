import { RootState, useRootSelector } from 'store'
import { NotificationsState } from 'store/notifications/notifications.reducer'

export const useNotifications = () => {
  const notifications = useRootSelector(
    (state: RootState) => state.notifications,
  )
  return notifications
}

export const useNotificationSelector = <T>(
  selector: (notifications: NotificationsState) => T,
) => {
  const data = useRootSelector((state: RootState) =>
    selector(state.notifications),
  )
  return data
}
