import { RootState, useRootSelector } from 'store'

export const useUserNotification = () => {
  const userNotification = useRootSelector(
    ({ userNotification }: RootState) => userNotification,
  )
  return userNotification
}
