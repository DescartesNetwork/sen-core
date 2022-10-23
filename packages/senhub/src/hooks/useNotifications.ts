import { RootState, useRootSelector } from 'store'

export const useNotifications = () => {
  const notifications = useRootSelector(
    (state: RootState) => state.notifications,
  )
  return notifications
}
