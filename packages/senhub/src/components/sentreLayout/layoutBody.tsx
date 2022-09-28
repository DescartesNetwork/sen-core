import { CSSProperties, ReactNode, useMemo } from 'react'

import { Col, Row } from 'antd'

import { useInfix } from 'hooks/useUI'
import { RootState, useRootSelector } from 'store'
import { Infix } from 'store/ui.reducer'
import { SIDEBAR_MIN_WIDTH, SIDEBAR_MAX_WIDTH } from './index'

const CONTENT_STYLE_DEFAULT: CSSProperties = {
  width: SIDEBAR_MIN_WIDTH,
  padding: 12,
}

type LayoutBodyProps = {
  children?: ReactNode
  style?: CSSProperties
  sidebarMaxWidth?: number
  sidebarMinWidth?: number
}
const LayoutBody = ({
  children,
  sidebarMaxWidth = SIDEBAR_MAX_WIDTH,
  sidebarMinWidth = SIDEBAR_MIN_WIDTH,
  style,
}: LayoutBodyProps) => {
  const visibleNavigation = useRootSelector(
    (state: RootState) => state.ui.visibleNavigation,
  )
  const infix = useInfix()
  const isMobile = infix < Infix.md
  // Navigation content style
  const contentStyle = useMemo(() => {
    const nextStyle = { ...CONTENT_STYLE_DEFAULT, width: '100%' }
    const offsetSidebar = visibleNavigation ? sidebarMaxWidth : sidebarMinWidth

    if (!isMobile) nextStyle.width = `calc(100vw - ${offsetSidebar}px)`
    return nextStyle
  }, [isMobile, sidebarMaxWidth, sidebarMinWidth, visibleNavigation])
  return (
    <div className="sentre-body" style={{ ...contentStyle, ...style }}>
      <Row gutter={[24, 24]}>
        <Col span={24}>{children}</Col>
      </Row>
    </div>
  )
}

export default LayoutBody
