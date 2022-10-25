import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

import configs from 'configs'

const { api } = configs

/**
 * Interface & Utility
 */

export type NotificationType = 'sentre'

export type AllowUpdateField = {
  seenUser: string[]
}

export type NotificationData = {
  _id: string
  type: NotificationType
  sender: string
  title: string[]
  content: string
  action: string
  broadcastedAt: Date
  createdAt: string
  updatedAt: string
}

export type NotificationsState = NotificationData[]

/**
 * Store constructor
 */

const NAME = 'notifications'
const initialState: NotificationsState = []

/**
 * Actions
 */

export const getNotifications = createAsyncThunk<
  NotificationsState,
  { limit: number; offset: number; broadcasted?: boolean },
  { state: any }
>(
  `${NAME}/getNotifications`,
  async ({ limit, offset, broadcasted = false }, { getState }) => {
    const { notifications } = getState()
    const { data: newNotifications } = await axios.get(api.notification.all, {
      params: {
        broadcasted,
        limit,
        offset,
      },
      withCredentials: true,
    })

    return [...notifications, ...newNotifications]
  },
)

export const addNotification = createAsyncThunk<
  NotificationsState,
  { notification: NotificationData },
  { state: any }
>(`${NAME}/addNotification`, async ({ notification }, { getState }) => {
  const { notifications } = getState()
  if (!notification._id) throw new Error('Notification is invalid!')
  return [notification, ...notifications]
})

/**
 * Usual procedure
 */

const slice = createSlice({
  name: NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    void builder
      .addCase(getNotifications.fulfilled, (_, { payload }) => payload)
      .addCase(addNotification.fulfilled, (_, { payload }) => payload),
})

export default slice.reducer
