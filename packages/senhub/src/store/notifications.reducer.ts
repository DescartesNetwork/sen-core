import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { isAddress } from 'shared/util'

/**
 * Interface & Utility
 */

export type DappData = {
  name: string
  logo: string
}

export type AllowUpdateField = {
  seen: boolean
}

export type NotificationsData = {
  dappId: DappData
  content: string
  name: string
  seen: boolean
  time: string
}
export type NotificationsState = Record<string, NotificationsData>

/**
 * Store constructor
 */

const NAME = 'notifications'
const initialState: NotificationsState = {}

/**
 * Actions
 */

export const getNotifications = createAsyncThunk(
  `${NAME}/getNotifications`,
  async (notifications: NotificationsState) => {
    return notifications
  },
)

// export const getNotification = createAsyncThunk<
//   NotificationsState,
//   { address: string },
//   { state: any }
// >(`${NAME}/getNotification`, async ({ address }, { getState }) => {
//   return {}
// })

export const addNotification = createAsyncThunk<
  NotificationsState,
  { id: string; notification: NotificationsData },
  { state: any }
>(`${NAME}/addNotification`, async ({ notification }, { getState }) => {
  if (!notification) throw new Error('Notification is invalid!')
  return { id: notification }
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
  { id: string; data: NotificationsData },
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
