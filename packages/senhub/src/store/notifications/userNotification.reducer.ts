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
  userAddress: '',
  readIds: [],
  notificationMark: '',
  offset: 0,
  limit: LIMIT,
}

/**
 * Actions
 */
export const getUserNotification = createAsyncThunk(
  `${NAME}/getUserNotification`,
  async ({ walletAddress }: { walletAddress: string }) => {
    const { data: notificationUser } = await axios.get(
      api.userNotification.index,
      {
        withCredentials: true,
      },
    )
    if (!notificationUser.userAddress) {
      const notificationUser = await updateUserNotification(walletAddress)
      return notificationUser
    }
    return notificationUser
  },
)

export const updateReadNotification = createAsyncThunk(
  `${NAME}/updateReadNotification`,
  async ({ _id }: { _id: string }) => {
    const { data: newUserNotification } = await axios.patch(
      api.userNotification.updateReadNotification + `/${_id}`,
      {},
      {
        withCredentials: true,
      },
    )

    return { ...newUserNotification }
  },
)

export const updateReadNotifications = createAsyncThunk(
  `${NAME}/updateReadNotifications`,
  async () => {
    const { data: newUser } = await axios.patch(
      api.userNotification.updateReadNotifications,
      {},
      {
        withCredentials: true,
      },
    )

    return { ...newUser }
  },
)

export const upsetPagination = createAsyncThunk(
  `${NAME}/upsetNotification`,
  async ({ limit, offset }: { offset: number; limit: number }) => {
    return { limit, offset }
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
