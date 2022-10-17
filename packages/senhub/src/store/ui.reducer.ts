import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

/**
 * Interface & Utility
 */

export enum Infix {
  xs = 0,
  sm = 576,
  md = 768,
  lg = 992,
  xl = 1200,
  xxl = 1400,
}
export type SidebarPosition = 'left' | 'right'
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
  visibleNavigation: boolean
  sidebarPosition: SidebarPosition
}

const getInfix = (): Infix => {
  const width = window.innerWidth
  if (width >= Infix.xxl) return Infix.xxl
  if (width >= Infix.xl) return Infix.xl
  if (width >= Infix.lg) return Infix.lg
  if (width >= Infix.md) return Infix.md
  if (width >= Infix.sm) return Infix.sm
  return Infix.xs
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
  visibleNavigation: getInfix() < Infix.md,
  background: {
    light: '',
    dark: '',
  },
  sidebarPosition: 'left',
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

export const setBackground = createAsyncThunk<
  Partial<UIState>,
  Background,
  { state: any }
>(`${NAME}/setBackground`, async (background, { getState }) => {
  const {
    ui: { background: preBackground },
  } = getState()
  if (JSON.stringify(preBackground) === JSON.stringify(background)) return {}
  return { background }
})

export const setVisibleNagivation = createAsyncThunk(
  `${NAME}/setVisibleNagivation`,
  async (visibleNavigation: boolean) => {
    return { visibleNavigation }
  },
)

export const setSidebarPosition = createAsyncThunk(
  `${NAME}/setSidebarPosition`,
  async (sidebarPosition: SidebarPosition) => {
    return { sidebarPosition }
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
      )
      .addCase(
        setVisibleNagivation.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        setSidebarPosition.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
