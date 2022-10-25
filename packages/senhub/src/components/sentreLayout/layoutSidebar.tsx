import { CSSProperties, ReactNode, useMemo } from 'react'

import { useInfix } from 'hooks/useUI'
import { RootState, useRootSelector } from 'store'
import { Infix } from 'store/ui.reducer'

export const SIDEBAR_MAX_WIDTH = 214
export const SIDEBAR_MIN_WIDTH = 64
export const SIDEBAR_STYLE_DEFAULT: CSSProperties = {
  width: SIDEBAR_MIN_WIDTH,
  position: 'fixed',
  top: 0,
  zIndex: 999,
}

type LayoutSideBarProps = {
  children?: ReactNode
  style?: CSSProperties
}
const LayoutSideBar = ({ children, style }: LayoutSideBarProps) => {
  const visibleNavigation = useRootSelector(
    ({ ui }: RootState) => ui.visibleNavigation,
  )
  const sidebarPosition = useRootSelector(
    ({ ui }: RootState) => ui.sidebarPosition,
  )
  const infix = useInfix()
  const isMobile = infix < Infix.md

  // Navigation sidebar style
  const barStyle: CSSProperties = useMemo(() => {
    const nextStyle = { ...SIDEBAR_STYLE_DEFAULT, [sidebarPosition]: 0 }
    const width = visibleNavigation ? SIDEBAR_MAX_WIDTH : SIDEBAR_MIN_WIDTH
    const translate = visibleNavigation ? 0 : -SIDEBAR_MIN_WIDTH
    const position = 'sticky'
    if (isMobile) return { ...nextStyle, [sidebarPosition]: translate }
    return { ...nextStyle, position, width }
  }, [isMobile, sidebarPosition, visibleNavigation])

  return (
    <div className="sentre-sidebar" style={{ ...barStyle, ...style }}>
      {children}
    </div>
  )
}

export default LayoutSideBar
