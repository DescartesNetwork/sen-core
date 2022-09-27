import { CSSProperties, ReactNode, useMemo } from 'react'

import { useInfix } from 'hooks/useUI'
import { RootState, useRootSelector } from 'store'
import { Infix } from 'store/ui.reducer'

import './index.os.less'

const SIDEBAR_MAX_WIDTH = 230
const SIDEBAR_MIN_WIDTH = 80
const CONTAINER_CLN = 'sentre-container'
const SIDEBAR_STYLE_DEFAULT: CSSProperties = {
  width: SIDEBAR_MIN_WIDTH,
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 99,
}
const CONTENT_STYLE_DEFAULT: CSSProperties = {
  width: SIDEBAR_MIN_WIDTH,
  padding: 12,
}

type LayoutNavigationProps = {
  sidebar?: ReactNode
  children?: ReactNode
  gap?: number
  style?: CSSProperties
  sidebarMaxWidth?: number
  sidebarMinWidth?: number
  navigaStyle?: CSSProperties
  bodyStyle?: CSSProperties
}
const LayoutNavigation = ({
  children,
  sidebar,
  gap = 0,
  style,
  sidebarMaxWidth = SIDEBAR_MAX_WIDTH,
  sidebarMinWidth = SIDEBAR_MIN_WIDTH,
  navigaStyle,
  bodyStyle,
}: LayoutNavigationProps) => {
  const visibleNavigation = useRootSelector(
    (state: RootState) => state.ui.visibleNavigation,
  )
  const infix = useInfix()
  const isMobile = infix < Infix.md

  // Navigation container class name
  const containerCln = !isMobile
    ? `${CONTAINER_CLN} sticky-menu`
    : CONTAINER_CLN

  // Navigation sidebar style
  const barStyle = useMemo(() => {
    const nextStyle = {
      ...SIDEBAR_STYLE_DEFAULT,
    }
    const width = visibleNavigation ? sidebarMaxWidth : sidebarMinWidth
    const left = visibleNavigation ? 0 : -sidebarMinWidth
    const position: CSSProperties['position'] = 'sticky'

    if (isMobile) return { ...nextStyle, left }
    return { ...nextStyle, position, width }
  }, [isMobile, sidebarMaxWidth, sidebarMinWidth, visibleNavigation])

  // Navigation content style
  const contentStyle = useMemo(() => {
    const nextStyle = { ...CONTENT_STYLE_DEFAULT, width: '100%' }
    const offsetSidebar = visibleNavigation ? sidebarMaxWidth : sidebarMinWidth

    if (!isMobile) nextStyle.width = `calc(100vw - ${offsetSidebar}px)`
    return nextStyle
  }, [isMobile, sidebarMaxWidth, sidebarMinWidth, visibleNavigation])

  return (
    <div className={containerCln} style={{ gap, ...style }}>
      <div className="sentre-sidebar" style={{ ...barStyle, ...navigaStyle }}>
        {sidebar}
      </div>
      <div className="sentre-body" style={{ ...contentStyle, ...bodyStyle }}>
        {children}
      </div>
    </div>
  )
}

export default LayoutNavigation
