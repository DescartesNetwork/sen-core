import { Fragment, useCallback, useEffect } from 'react'

import {
  useRootDispatch,
  RootDispatch,
  useRootSelector,
  RootState,
} from 'store'
import {
  addNotification,
  getNotifications,
  getUnreadNotificationCount,
  getUserNotification,
} from 'store/notifications.reducer'
import configs from 'configs'

const { api } = configs
const eventSource = new EventSource(api.notification.SSE)

const NotificationsWatcher = () => {
  const dispatch = useRootDispatch<RootDispatch>()
  const walletAddress = useRootSelector(
    ({ user }: RootState) => user.walletAddress,
  )

  const fetchUserNotification = useCallback(async () => {
    if (!walletAddress) return
    try {
      await dispatch(getUserNotification())
    } catch (e) {
      return window.notify({
        type: 'error',
        description: 'Cannot fetch user notifications',
      })
    }
  }, [dispatch, walletAddress])

  const fetchUnreadNotificationCount = useCallback(async () => {
    if (!walletAddress) return
    try {
      await dispatch(getUnreadNotificationCount())
    } catch (e) {
      return window.notify({
        type: 'error',
        description: 'Cannot fetch unread count',
      })
    }
  }, [dispatch, walletAddress])

  // First-time fetching
  const fetchNotifications = useCallback(async () => {
    try {
      await dispatch(getNotifications({ offset: 0 }))
    } catch (er) {
      return window.notify({
        type: 'error',
        description: 'Cannot fetch notifications',
      })
    }
  }, [dispatch])
  // Watch account changes
  const watchNotification = useCallback(async () => {
    eventSource.onmessage = async ({ data }) => {
      const notification = JSON.parse(data)
      await dispatch(addNotification({ notification }))
    }
  }, [dispatch])

  useEffect(() => {
    fetchNotifications()
    watchNotification()
  }, [fetchNotifications, watchNotification])

  useEffect(() => {
    fetchUserNotification()
  }, [fetchUserNotification])

  useEffect(() => {
    fetchUnreadNotificationCount()
  }, [fetchUnreadNotificationCount])

  return <Fragment />
}

export default NotificationsWatcher
