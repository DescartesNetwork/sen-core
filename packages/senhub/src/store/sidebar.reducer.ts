import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export type SidebarState = { visible: boolean }

/**
 * Store constructor
 */

const NAME = 'sidebar'
const initialState: SidebarState = { visible: true }

/**
 * Actions
 */

export const setVisibleSideBar = createAsyncThunk(
  `${NAME}/setVisibleSideBar`,
  async (visible: boolean) => {
    return { visible }
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
    void builder.addCase(
      setVisibleSideBar.fulfilled,
      (state, { payload }) => void Object.assign(state, payload),
    ),
})

export default slice.reducer
