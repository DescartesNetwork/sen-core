import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

import { OnCreateNotificationProps } from 'hooks/admin/useCreateNotification'
import configs from 'configs'
import { OnUpdateNotificationProps } from 'hooks/admin/useUpdateNotification'

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
  title: string
  content: string
  action: string
  broadcastedAt: string
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

    return formattedData
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

export const createNotification = createAsyncThunk<
  NotificationsState,
  OnCreateNotificationProps,
  { state: any }
>(`${NAME}/createNotification`, async (data, { getState }) => {
  const { data: notification, status } = await axios.post(
    api.notification.index,
    { ...data, type: 'sentre' },
    {
      withCredentials: true,
    },
  )
  if (status !== 201) throw Error('Fail in creating notification')
  return { [notification._id]: notification }
})

export const upsetNotification = createAsyncThunk<
  NotificationsState,
  OnUpdateNotificationProps,
  { state: any }
>(`${NAME}/upsetNotification`, async (data) => {
  if (!data._id) throw new Error('Not found notification Id')
  const { data: notification, status } = await axios.patch(
    api.notification.index + `/${data._id}`,
    data,
    {
      withCredentials: true,
    },
  )
  if (status !== 200) throw Error('Fail in creating notification')
  return { [notification._id]: notification }
})

export const deleteNotification = createAsyncThunk<
  NotificationsState,
  { notificationId: string },
  { state: any }
>(`${NAME}/deleteNotification`, async ({ notificationId }, { getState }) => {
  const { notifications } = getState()
  const { status } = await axios.delete(
    api.notification.index + `/${notificationId}`,
    {
      withCredentials: true,
    },
  )
  if (status !== 200) throw Error('Fail in creating notification')
  delete notifications[notificationId]
  return notifications
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
        createNotification.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(deleteNotification.fulfilled, (_, { payload }) => payload),
})

export default slice.reducer
