import { useCallback, useState } from 'react'

import { RootDispatch, useRootDispatch } from 'store'
import {
  createNotification,
  NotificationType,
} from 'store/notifications/notifications.reducer'

export type OnCreateNotificationProps = {
  type?: NotificationType
  sender: string
  thumbnail: string
  title: string
  content: string
  action: string
  broadcastedAt: string
}
export const useCreateNotification = () => {
  const [loading, setLoading] = useState(false)
  const dispatch = useRootDispatch<RootDispatch>()

  const onCreateNotification = useCallback(
    async (data: OnCreateNotificationProps) => {
      try {
        setLoading(true)
        await dispatch(createNotification(data))
        window.notify({ type: 'success', description: 'Create notification' })
      } catch (err) {
        window.notify({ type: 'error', description: `${err}` })
      } finally {
        setLoading(false)
      }
    },
    [dispatch],
  )

  return { onCreateNotification, loading }
}
