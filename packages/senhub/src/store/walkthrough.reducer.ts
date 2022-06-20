import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

/**
 * Interface & Utility
 */
export enum WalkThroughType {
  Default,
  NewComer,
}

type WalkThorughState = {
  type: WalkThroughType
  run: boolean
  step: number
}

/**
 * Store constructor
 */

const NAME = 'walkthrough'
const initialState: WalkThorughState = {
  type: WalkThroughType.Default,
  run: false,
  step: 0,
}

/**
 * Actions
 */

export const setWalkthrough = createAsyncThunk<
  Partial<WalkThorughState>,
  Partial<WalkThorughState>,
  { state: any }
>(`${NAME}/setWalkthrough`, async (state) => {
  return { ...state }
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
      setWalkthrough.fulfilled,
      (state, { payload }) => void Object.assign(state, payload),
    ),
})

export default slice.reducer
