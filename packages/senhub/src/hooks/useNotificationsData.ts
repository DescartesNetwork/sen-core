import { RootState, useRootSelector } from 'store'

export const useNotificationsData = () => {
  const notificationsData = useRootSelector(
    ({ notifications: { notificationsData } }: RootState) => notificationsData,
  )
  return notificationsData
}
