import { RootState, useRootSelector } from 'store'

export const useNotifications = () => {
  const notifications = useRootSelector(
    ({ notifications }: RootState) => notifications,
  )
  return notifications
}
