import { useCallback, useState } from 'react'

import { RootDispatch, useRootDispatch } from 'store'
import { deleteNotification } from 'store/notifications/notifications.reducer'

export const useDeleteNotification = () => {
  const [loading, setLoading] = useState(false)
  const dispatch = useRootDispatch<RootDispatch>()

  const onDeleteNotification = useCallback(
    async (notificationId) => {
      try {
        setLoading(true)
        await dispatch(deleteNotification({ notificationId }))
        window.notify({ type: 'success', description: 'Delete notification' })
      } catch (err) {
        window.notify({ type: 'error', description: `${err}` })
      } finally {
        setLoading(false)
      }
    },
    [dispatch],
  )

  return { onDeleteNotification, loading }
}
