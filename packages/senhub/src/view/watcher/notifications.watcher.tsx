import { Fragment, useCallback, useEffect } from 'react'

import { useRootDispatch, RootDispatch } from 'store'
import { useWalletAddress } from 'hooks/useWallet'
import {
  addNotification,
  DEFAUlT_LIMIT,
  getNotifications,
  getUserNotification,
  upsetPagination,
} from 'store/notifications.reducer'
import { useNotificationPagination } from 'hooks/useNotificationPagination'
import configs from 'configs'

const { api } = configs
const eventSource = new EventSource(api.notification.SSE)

const NotificationsWatcher = () => {
  const walletAddress = useWalletAddress()
  const { offset, limit } = useNotificationPagination()
  const dispatch = useRootDispatch<RootDispatch>()

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

  // First-time fetching
  const fetchNotifications = useCallback(async () => {
    try {
      await dispatch(
        getNotifications({
          offset,
          limit,
        }),
      )
      await dispatch(
        upsetPagination({
          offset: limit,
          limit: limit + DEFAUlT_LIMIT,
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

  return <Fragment />
}

export default NotificationsWatcher
