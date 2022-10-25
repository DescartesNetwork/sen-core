import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

import configs from 'configs'

const { api } = configs

export const LIMIT = 10

const updateUserNotification = async (userAddress: string) => {
  const { data } = await axios.post(
    api.userNotification.index,
    { userAddress },
    {
      withCredentials: true,
    },
  )
  return data
}

/**
 * Interface & Utility
 */

export type UserNotificationState = {
  _id: string
  userAddress: string
  readIds: string[]
  notificationMark: string
  offset: number
  limit: number
}

/**
 * Store constructor
 */

const NAME = 'notificationUser'
const initialState: UserNotificationState = {
  _id: '',
  userAddress: '',
  readIds: [],
  notificationMark: '',
  offset: 0,
  limit: LIMIT,
}

/**
 * Actions
 */
export const getUserNotification = createAsyncThunk<
  UserNotificationState,
  { walletAddress: string },
  { state: any }
>(`${NAME}/getUserNotification`, async ({ walletAddress }, { getState }) => {
  const { data: notificationUser } = await axios.get(
    api.userNotification.index + `?userAddress=${walletAddress}`,
    {
      withCredentials: true,
    },
  )
  if (!notificationUser._id) {
    const notificationUser = await updateUserNotification(walletAddress)
    return notificationUser
  }

  console.log('chay vao hamf get User Notification', notificationUser)
  return notificationUser
})

export const updateReadNotification = createAsyncThunk<
  UserNotificationState,
  { _id: string; userNotificationId: string },
  { state: any }
>(
  `${NAME}/updateReadNotification`,
  async ({ _id, userNotificationId }, { getState }) => {
    const { data: newUserNotification } = await axios.patch(
      api.userNotification.updateReadNotification + `/${_id}`,
      { userNotificationId },
      {
        withCredentials: true,
      },
    )

    return { ...newUserNotification }
  },
)

export const updateReadNotifications = createAsyncThunk<
  UserNotificationState,
  { userNotificationId: string },
  { state: any }
>(`${NAME}/updateReadNotifications`, async ({ userNotificationId }) => {
  const { data: newUser } = await axios.patch(
    api.userNotification.updateReadNotifications,
    { userNotificationId },
    {
      withCredentials: true,
    },
  )

  return { ...newUser }
})

export const upsetPagination = createAsyncThunk<
  Partial<UserNotificationState>,
  { offset: number; limit: number },
  { state: any }
>(`${NAME}/upsetNotification`, async ({ limit, offset }) => {
  return { limit, offset }
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
      .addCase(
        getUserNotification.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        updateReadNotification.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        updateReadNotifications.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        upsetPagination.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
