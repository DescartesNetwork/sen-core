import { Fragment, useCallback, useEffect } from 'react'
import axios from 'axios'

import { useRootDispatch, RootDispatch } from 'store'
import configs from 'configs'
import {
  addNotification,
  getNotifications,
  NotificationData,
} from 'store/notifications/notifications.reducer'

const { api } = configs
const eventSource = new EventSource(api.notification.SSE)

const NotificationsWatcher = () => {
  const dispatch = useRootDispatch<RootDispatch>()

  // First-time fetching
  const fetchData = useCallback(async () => {
    try {
      const { data: notifications } = await axios.get(api.notification.all, {
        withCredentials: true,
      })
      const formatedData: Record<string, NotificationData> = {}
      for (const notification of notifications) {
        formatedData[notification._id] = notification
      }

      await dispatch(getNotifications(formatedData))
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
