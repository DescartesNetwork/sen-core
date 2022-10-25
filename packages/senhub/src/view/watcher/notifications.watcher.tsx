import { Fragment, useCallback, useEffect } from 'react'

import { useRootDispatch, RootDispatch } from 'store'
import {
  addNotification,
  getNotifications,
} from 'store/notifications/notifications.reducer'
import {
  getUserNotification,
  LIMIT,
  upsetPagination,
} from 'store/notifications/userNotification.reducer'
import configs from 'configs'
import { useWalletAddress } from 'hooks/useWallet'

const { api } = configs
const eventSource = new EventSource(api.notification.SSE)

const NotificationsWatcher = () => {
  const walletAddress = useWalletAddress()
  const dispatch = useRootDispatch<RootDispatch>()

  const fetchUserNotification = useCallback(async () => {
    if (!walletAddress) return
    try {
      await dispatch(getUserNotification({ walletAddress }))
    } catch (e) {
      return window.notify({
        type: 'error',
        description: 'Cannot fetch user notifications',
      })
    }
  }, [dispatch, walletAddress])

  // First-time fetching
  const fetchNotification = useCallback(async () => {
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
      const notification = JSON.parse(data)
      await dispatch(addNotification({ notification }))
    }
  }, [dispatch])

  useEffect(() => {
    fetchNotification()
    watchData()
  }, [fetchNotification, watchData])

  useEffect(() => {
    fetchUserNotification()
  }, [fetchUserNotification])

  return <Fragment />
}

export default NotificationsWatcher
