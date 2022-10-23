import { useCallback, useState } from 'react'

import { RootDispatch, useRootDispatch } from 'store'
import {
  NotificationType,
  upsetNotification,
} from 'store/notifications/notifications.reducer'

export type OnUpdateNotificationProps = {
  _id: string
  type?: NotificationType
  sender: string
  thumbnail: string
  title: string
  content: string
  action: string
  broadcastedAt: string
}
export const useUpdateNotification = () => {
  const [loading, setLoading] = useState(false)
  const dispatch = useRootDispatch<RootDispatch>()

  const onUpdateNotification = useCallback(
    async (data: OnUpdateNotificationProps) => {
      try {
        setLoading(true)
        await dispatch(upsetNotification(data))
        window.notify({ type: 'success', description: 'Update notification' })
      } catch (err) {
        window.notify({ type: 'error', description: `${err}` })
      } finally {
        setLoading(false)
      }
    },
    [dispatch],
  )

  return { onUpdateNotification, loading }
}
