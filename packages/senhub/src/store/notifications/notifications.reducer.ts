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
  thumbnail: string
  title: string[]
  content: string
  action: string
  broadcastedAt: Date
  createdAt: string
  updatedAt: string
}

export type NotificationsState = Record<string, NotificationData>

/**
 * Store constructor
 */

const NAME = 'notifications'
const initialState: NotificationsState = {}

/**
 * Actions
 */

export const getNotifications = createAsyncThunk<
  NotificationsState,
  { limit: number; offset: number; broadcasted?: boolean },
  { state: any }
>(
  `${NAME}/getNotifications`,
  async ({ limit, offset, broadcasted = false }) => {
    const { data: notifications } = await axios.get(api.notification.all, {
      params: {
        broadcasted,
        limit,
        offset,
      },
      withCredentials: true,
    })
    const formattedData: Record<string, NotificationData> = {}
    for (const notification of notifications) {
      formattedData[notification._id] = notification
    }

    return notifications
  },
)

export const addNotification = createAsyncThunk<
  NotificationsState,
  { id: string; notification: NotificationData },
  { state: any }
>(`${NAME}/addNotification`, async ({ id, notification }, { getState }) => {
  if (!notification || !id) throw new Error('Notification is invalid!')
  return { [id]: notification }
})

export const upsetAllNotifications = createAsyncThunk<
  NotificationsState,
  AllowUpdateField,
  { state: any }
>(`${NAME}/updateAllNotifications`, async (info, { getState }) => {
  const { notifications } = getState()
  const newNotifications: NotificationsState = {}
  for (const id in notifications) {
    newNotifications[id] = { ...notifications[id], ...info }
  }
  return newNotifications
})

export const upsetNotification = createAsyncThunk<
  NotificationsState,
  { id: string; data: NotificationData },
  { state: any }
>(`${NAME}/upsetNotification`, async ({ id, data }) => {
  if (!data) throw new Error('Data is empty')
  return { [id]: data }
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
      .addCase(getNotifications.fulfilled, (state, { payload }) => payload)
      .addCase(
        addNotification.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        upsetNotification.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        upsetAllNotifications.fulfilled,
        (state, { payload }) => payload,
      ),
})

export default slice.reducer
