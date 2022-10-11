import { Fragment, useCallback, useEffect } from 'react'
import axios from 'axios'
import io from 'socket.io-client'

import { useRootDispatch, RootDispatch } from 'store'
import { useWalletAddress } from 'hooks/useWallet'
import configs from 'configs'
import {
  addNotification,
  getNotifications,
  NotificationsData,
} from 'store/notifications.reducer'

const socket = io('https://powerful-tundra-13192.herokuapp.com/')
const { api } = configs

const NotificationsWatcher = () => {
  const dispatch = useRootDispatch<RootDispatch>()
  const walletAddress = useWalletAddress()
  console.log('NotificationsWatcher')

  // First-time fetching
  const fetchData = useCallback(async () => {
    try {
      const { data: notifications } = await axios.get(api.notifications.all)
      const formatedData: Record<string, NotificationsData> = {}
      for (const notification of notifications) {
        formatedData[notification._id] = notification
      }

      console.log('notification: ', formatedData)

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
    socket.on('notification', (data) => {
      console.log('thong tin events: ', data)
      // dispatch(addNotification())
    })
  }, [dispatch])

  useEffect(() => {
    fetchData()
    watchData()
  }, [fetchData, watchData])

  return <Fragment />
}

export default NotificationsWatcher
