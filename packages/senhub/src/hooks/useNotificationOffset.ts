import { RootState, useRootSelector } from 'store'

export const useNotificationOffset = () => {
  const notificationOffset = useRootSelector(
    ({ notifications: { offset } }: RootState) => offset,
  )
  return notificationOffset
}
