import { CSSProperties, ReactNode, useMemo } from 'react'

import { useInfix } from 'hooks/useUI'
import { RootState, useRootSelector } from 'store'
import { Infix } from 'store/ui.reducer'
import { SIDEBAR_MIN_WIDTH, SIDEBAR_MAX_WIDTH } from './index'

const SIDEBAR_STYLE_DEFAULT: CSSProperties = {
  width: SIDEBAR_MIN_WIDTH,
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 999,
}

type LayoutSideBarProps = {
  children?: ReactNode
  style?: CSSProperties
  sidebarMaxWidth?: number
  sidebarMinWidth?: number
}
const LayoutSideBar = ({
  children,
  sidebarMaxWidth = SIDEBAR_MAX_WIDTH,
  sidebarMinWidth = SIDEBAR_MIN_WIDTH,
  style,
}: LayoutSideBarProps) => {
  const visibleNavigation = useRootSelector(
    (state: RootState) => state.ui.visibleNavigation,
  )
  const sidebarPosition = useRootSelector(
    (state: RootState) => state.ui.sidebarPosition,
  )
  const infix = useInfix()
  const isMobile = infix < Infix.md

  // Navigation sidebar style
  const barStyle = useMemo(() => {
    const nextStyle = {
      ...SIDEBAR_STYLE_DEFAULT,
    }
    const width = visibleNavigation ? sidebarMaxWidth : sidebarMinWidth
    const translate = visibleNavigation ? 0 : -sidebarMinWidth
    const position: CSSProperties['position'] = 'sticky'

    if (isMobile) return { ...nextStyle, [sidebarPosition]: translate }
    return { ...nextStyle, position, width }
  }, [
    isMobile,
    sidebarMaxWidth,
    sidebarMinWidth,
    sidebarPosition,
    visibleNavigation,
  ])

  return (
    <div className="sentre-sidebar" style={{ ...barStyle, ...style }}>
      {children}
    </div>
  )
}

export default LayoutSideBar
