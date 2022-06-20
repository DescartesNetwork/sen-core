import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

/**
 * Interface & Utility
 */

type SearchState = {
  visible: boolean
  value: string
  loading: boolean
  disabled: boolean
}

/**
 * Store constructor
 */

const NAME = 'search'
const initialState: SearchState = {
  visible: false,
  value: '',
  loading: false,
  disabled: false,
}

/**
 * Actions
 */

export const setVisible = createAsyncThunk(
  `${NAME}/setVisible`,
  async (visible: boolean) => {
    return { visible }
  },
)

export const setValue = createAsyncThunk(
  `${NAME}/setValue`,
  async (value: string) => {
    return { value }
  },
)

export const setLoading = createAsyncThunk(
  `${NAME}/setLoading`,
  async (loading: boolean) => {
    return { loading }
  },
)

export const setDisabled = createAsyncThunk(
  `${NAME}/setDisabled`,
  async (disabled: boolean) => {
    return { disabled }
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
        setVisible.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        setValue.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        setLoading.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        setDisabled.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
