import { RootState, useRootSelector } from 'store'

export const useUserNotification = () => {
  const userNotification = useRootSelector(
    (state: RootState) => state.userNotification,
  )
  return userNotification
}
