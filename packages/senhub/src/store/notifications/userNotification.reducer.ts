import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

import configs from 'configs'

const { api } = configs

/**
 * Interface & Utility
 */

export type UserNotificationState = {
  _id: string
  userAddress: string
  readIds: string[]
  notificationMark: string
  createdAt: string
  updatedAt: string
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
  createdAt: '',
  updatedAt: '',
}

/**
 * Actions
 */
export const getUserNotification = createAsyncThunk<
  UserNotificationState,
  void,
  { state: any }
>(`${NAME}/getUserNotification`, async (_, { getState }) => {
  const {
    user: { walletAddress },
  } = getState()
  const { data: notificationUser } = await axios.get(
    api.userNotification.index + `?userAddress=${walletAddress}`,
    {
      withCredentials: true,
    },
  )
  return notificationUser
})

export const upsetUserNotification = createAsyncThunk<
  UserNotificationState,
  { _id: string; userNotificationId: string },
  { state: any }
>(
  `${NAME}/upsetUserNotification`,
  async ({ _id, userNotificationId }, { getState }) => {
    const { data: newUser } = await axios.patch(
      api.userNotification.updateReadNotification + `/${_id}`,
      { userNotificationId },
      {
        withCredentials: true,
      },
    )

    return { ...newUser }
  },
)

export const upsetUserNotifications = createAsyncThunk<
  UserNotificationState,
  { userNotificationId: string },
  { state: any }
>(
  `${NAME}/upsetUserNotifications`,
  async ({ userNotificationId }, { getState }) => {
    const { data: newUser } = await axios.patch(
      api.userNotification.updateReadNotifications,
      { userNotificationId },
      {
        withCredentials: true,
      },
    )

    return { ...newUser }
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
        getUserNotification.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        upsetUserNotification.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        upsetUserNotifications.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
