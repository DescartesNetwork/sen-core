import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

/**
 * Interface & Utility
 */

export type Infix = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
export type Theme = 'light' | 'dark'
export type Background = Record<Theme, string | undefined>

export type UIState = {
  theme: Theme
  width: number
  infix: Infix
  touchable: boolean
  visibleActionCenter: boolean
  visibleInstaller: boolean
  background: Background
}

const getInfix = (): Infix => {
  const width = window.innerWidth
  if (width < 576) return 'xs'
  if (width < 768) return 'sm'
  if (width < 992) return 'md'
  if (width < 1200) return 'lg'
  if (width < 1400) return 'xl'
  return 'xxl'
}
const isTouchable = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}
const getTheme = (): Theme => {
  if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light'
  return 'dark'
}

/**
 * Store constructor
 */

const NAME = 'ui'
const initialState: UIState = {
  theme: getTheme(),
  width: window.innerWidth,
  infix: getInfix(),
  touchable: isTouchable(),
  visibleActionCenter: false,
  visibleInstaller: false,
  background: {
    light: '',
    dark: '',
  },
}

/**
 * Actions
 */

export const setTheme = createAsyncThunk(
  `${NAME}/setTheme`,
  async (theme: Theme) => {
    return { theme }
  },
)

export const resize = createAsyncThunk(`${NAME}/resize`, async () => {
  const width = window.innerWidth
  const infix = getInfix()
  return { width, infix }
})

export const setVisibleActionCenter = createAsyncThunk(
  `${NAME}/setVisibleActionCenter`,
  async (visible: boolean) => {
    return { visibleActionCenter: visible }
  },
)

export const setVisibleInstaller = createAsyncThunk(
  `${NAME}/setVisibleInstaller`,
  async (visible: boolean) => {
    return { visibleInstaller: visible }
  },
)

export const setBackground = createAsyncThunk(
  `${NAME}/setBackground`,
  async (background: Background) => {
    return { background }
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
        setTheme.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        resize.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        setVisibleActionCenter.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        setVisibleInstaller.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        setBackground.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
