import { RootState, useRootSelector } from 'store'

export const useUserNotification = () => {
  const userNotification = useRootSelector(
    ({ notifications: { userNotification } }: RootState) => userNotification,
  )
  return userNotification
}
