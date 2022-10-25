import { useCallback, useMemo } from 'react'
import isEqual from 'react-fast-compare'

import {
  RootDispatch,
  RootState,
  useRootDispatch,
  useRootSelector,
} from 'store'
import { Background, Infix, setBackground } from 'store/ui.reducer'
import {
  SIDEBAR_MAX_WIDTH,
  SIDEBAR_MIN_WIDTH,
} from 'components/sentreLayout/layoutSidebar'

export { Infix } from 'store/ui.reducer'

export const useWidth = () => {
  const width = useRootSelector(({ ui }: RootState) => ui.width)
  return width
}

export const useAppWidth = () => {
  const visibleNavigation = useRootSelector(
    ({ ui }: RootState) => ui.visibleNavigation,
  )
  const infix = useInfix()
  const isMobile = useMemo(() => infix < Infix.md, [infix])
  const sidebarWidth = useMemo(
    () => (visibleNavigation ? SIDEBAR_MAX_WIDTH : SIDEBAR_MIN_WIDTH),
    [visibleNavigation],
  )
  if (isMobile) return window.innerWidth
  return window.innerWidth - sidebarWidth
}

export const useAppSide = () => {
  const sidebarPosition = useRootSelector(
    ({ ui }: RootState) => ui.sidebarPosition,
  )
  return sidebarPosition === 'left' ? 'right' : 'left'
}

export const useInfix = () => {
  const infix = useRootSelector(({ ui }: RootState) => ui.infix)
  return infix
}

export const useTouchable = () => {
  const touchable = useRootSelector(({ ui }: RootState) => ui.touchable)
  return touchable
}

export const useTheme = () => {
  const theme = useRootSelector(({ ui }: RootState) => ui.theme)
  return theme
}

export const useSetBackground = () => {
  const dispatch = useRootDispatch<RootDispatch>()
  const prevBackground = useRootSelector(({ ui }: RootState) => ui.background)
  const setBg = useCallback(
    (background: Background) => {
      if (!isEqual(prevBackground, background))
        dispatch(setBackground(background))
    },
    [dispatch, prevBackground],
  )
  return setBg
}
