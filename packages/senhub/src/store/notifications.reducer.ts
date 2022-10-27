import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

import configs from 'configs'

const { api } = configs

export const DEFAUlT_LIMIT = 10

const INITIAL_PAGINATION = {
  offset: 0,
  limit: DEFAUlT_LIMIT,
}

const INITIAL_USER_NOTIFICATION = {
  userAddress: '',
  readIds: [],
  notificationMark: '',
}

const updateUserNotification = async () => {
  const { data } = await axios.post(
    api.userNotification.index,
    {},
    {
      withCredentials: true,
    },
  )
  return data
}

/**
 * Interface & Utility
 */

export type UserNotification = {
  userAddress: string
  readIds: string[]
  notificationMark: string
}

export type Pagination = {
  offset: number
  limit: number
}

export type NotificationType = 'sentre' | 'quest'

export type NotificationData = {
  _id: string
  type: NotificationType
  sender: string
  title: string[]
  content: string
  action: string
  broadcastedAt: Date
}

export type NotificationsState = {
  notificationsData: NotificationData[]
  pagination: Pagination
  userNotification: UserNotification
  unreadCount: number
}

/**
 * Store constructor
 */

const NAME = 'notifications'
const initialState: NotificationsState = {
  notificationsData: [],
  pagination: INITIAL_PAGINATION,
  userNotification: INITIAL_USER_NOTIFICATION,
  unreadCount: 0,
}

/**
 * Actions
 */

export const getNotifications = createAsyncThunk<
  Partial<NotificationsState>,
  Pagination,
  { state: any }
>(`${NAME}/getNotifications`, async ({ limit, offset }, { getState }) => {
  const {
    notifications: { notificationsData },
  } = getState()
  const { data: newNotifications } = await axios.get(api.notification.index, {
    params: {
      broadcasted: true, // get broadcasted notification only
      limit,
      offset,
    },
  })
  return { notificationsData: [...notificationsData, ...newNotifications] }
})

export const addNotification = createAsyncThunk<
  Partial<NotificationsState>,
  { notification: NotificationData },
  { state: any }
>(`${NAME}/addNotification`, async ({ notification }, { getState }) => {
  const {
    notifications: { notificationsData },
  } = getState()

  if (!notification._id) throw new Error('Notification is invalid!')

  return { notificationsData: [notification, ...notificationsData] }
})

export const getUserNotification = createAsyncThunk(
  `${NAME}/getUserNotification`,
  async () => {
    const { data: userNotification } = await axios.get(
      api.userNotification.index,
      {
        withCredentials: true,
      },
    )
    if (!userNotification.userAddress) return await updateUserNotification()

    return { userNotification }
  },
)

export const getUnreadNotificationCount = createAsyncThunk(
  `${NAME}/getUnreadNotificationCount`,
  async () => {
    const { data: unreadCount } = await axios.get(
      api.userNotification.unreadCount,
      {
        withCredentials: true,
      },
    )

    return { unreadCount }
  },
)

export const upsetUserNotification = createAsyncThunk<
  Partial<NotificationsState>,
  { userNotification: UserNotification; readOne?: boolean },
  { state: any }
>(
  `${NAME}/upsetUserNotification`,
  async ({ userNotification, readOne = false }, { getState }) => {
    const {
      notifications: { userNotification: prevUserNotification, unreadCount },
    } = getState()
    const { data: newUserNotification } = await axios.put(
      api.userNotification.index,
      { sync: readOne, ...userNotification },
      {
        withCredentials: true,
      },
    )
    return {
      userNotification: { ...prevUserNotification, ...newUserNotification },
      unreadCount: readOne ? unreadCount - 1 : 0,
    }
  },
)

export const upsetPagination = createAsyncThunk(
  `${NAME}/upsetNotification`,
  async (pagination: Pagination) => {
    return { pagination }
  },
)

/**
 * Usual procedure
 */

const slice = createSlice({
  name: NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    void builder
      .addCase(
        getNotifications.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        addNotification.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        getUserNotification.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        getUnreadNotificationCount.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        upsetUserNotification.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        upsetPagination.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
