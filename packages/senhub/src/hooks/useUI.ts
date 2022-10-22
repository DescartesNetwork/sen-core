import { useCallback } from 'react'
import isEqual from 'react-fast-compare'

import {
  RootDispatch,
  RootState,
  useRootDispatch,
  useRootSelector,
} from 'store'
import { Background, setBackground } from 'store/ui.reducer'

export { Infix } from 'store/ui.reducer'

export const useWidth = () => {
  const width = useRootSelector(({ ui }: RootState) => ui.width)
  return width
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
