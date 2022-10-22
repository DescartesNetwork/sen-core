import { RootState, useRootSelector } from 'store'
import { UserNotificationState } from 'store/notifications/userNotification.reducer'

export const useUserNotification = () => {
  const userNotification = useRootSelector(
    (state: RootState) => state.userNotification,
  )
  return userNotification
}

export const useUserNotificationSelector = <T>(
  selector: (notifications: UserNotificationState) => T,
) => {
  const data = useRootSelector((state: RootState) =>
    selector(state.userNotification),
  )
  return data
}
