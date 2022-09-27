import { CSSProperties, ReactNode } from 'react'

import { useInfix } from 'hooks/useUI'
import { Infix } from 'store/ui.reducer'

import './index.os.less'

export const SIDEBAR_MAX_WIDTH = 230
export const SIDEBAR_MIN_WIDTH = 80
const CONTAINER_CLN = 'sentre-container'

type LayoutNavigateProps = {
  children?: ReactNode
  gap?: number
  style?: CSSProperties
}
const LayoutNavigate = ({ gap = 0, style, children }: LayoutNavigateProps) => {
  const infix = useInfix()
  const isMobile = infix < Infix.md

  // Navigation container class name
  const containerCln = !isMobile
    ? `${CONTAINER_CLN} sticky-menu`
    : CONTAINER_CLN

  return (
    <div className={containerCln} style={{ gap, ...style }}>
      {children}
    </div>
  )
}

export default LayoutNavigate
