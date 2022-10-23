import { Fragment, useCallback, useEffect } from 'react'

import { useRootDispatch, RootDispatch } from 'store'
import {
  addNotification,
  getNotifications,
} from 'store/notifications/notifications.reducer'
import { LIMIT, upsetPagination } from 'store/notifications/pagination.reducer'
import configs from 'configs'

const { api } = configs
const eventSource = new EventSource(api.notification.SSE)

const NotificationsWatcher = () => {
  const dispatch = useRootDispatch<RootDispatch>()

  // First-time fetching
  const fetchData = useCallback(async () => {
    try {
      await dispatch(
        getNotifications({
          offset: 0,
          limit: LIMIT,
          broadcasted: true,
        }),
      )
      await dispatch(
        upsetPagination({
          offset: LIMIT,
          limit: LIMIT + LIMIT,
        }),
      )
    } catch (er) {
      return window.notify({
        type: 'error',
        description: 'Cannot fetch notifications',
      })
    }
  }, [dispatch])
  // Watch account changes
  const watchData = useCallback(async () => {
    eventSource.onmessage = async ({ data }) => {
      const notification = JSON.parse(data).emitting
      await dispatch(addNotification({ id: notification._id, notification }))
    }
  }, [dispatch])

  useEffect(() => {
    fetchData()
    watchData()
  }, [fetchData, watchData])

  return <Fragment />
}

export default NotificationsWatcher
