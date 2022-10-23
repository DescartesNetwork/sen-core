import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const LIMIT = 10

export type PaginationState = {
  offset: number
  limit: number
}

/**
 * Store constructor
 */

const NAME = 'pagination'
const initialState: PaginationState = {
  offset: 0,
  limit: LIMIT,
}

/**
 * Actions
 */

export const upsetPagination = createAsyncThunk<
  PaginationState,
  PaginationState,
  { state: any }
>(`${NAME}/upsetNotification`, async (newPagination, { getState }) => {
  const { pagination } = getState()
  return { ...pagination, ...newPagination }
})

/**
 * Usual procedure
 */

const slice = createSlice({
  name: NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    void builder.addCase(
      upsetPagination.fulfilled,
      (state, { payload }) => payload,
    ),
})

export default slice.reducer
