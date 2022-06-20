import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

/**
 * Interface & Utility
 */

export type State = {
  counter: number
}

/**
 * Store constructor
 */

const NAME = 'main'
const initialState: State = {
  counter: 0,
}

/**
 * Actions
 */

export const increaseCounter = createAsyncThunk<State, void, { state: any }>(
  `${NAME}/increaseCounter`,
  async (_, { getState }) => {
    const {
      main: { counter },
    } = getState()
    return { counter: counter + 1 }
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
      increaseCounter.fulfilled,
      (state, { payload }) => void Object.assign(state, payload),
    ),
})

export default slice.reducer
