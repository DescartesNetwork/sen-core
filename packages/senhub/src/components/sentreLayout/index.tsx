import { CSSProperties, ReactNode, useMemo } from 'react'

import { useInfix } from 'hooks/useUI'
import { Infix } from 'store/ui.reducer'
import { RootState, useRootSelector } from 'store'

import './index.os.less'

const CONTAINER_CLN = 'sentre-container'

type SentreLayoutProps = {
  children?: ReactNode
  gap?: number
  style?: CSSProperties
}
const SentreLayout = ({ gap = 0, style, children }: SentreLayoutProps) => {
  const sidebarPosition = useRootSelector(
    ({ ui }: RootState) => ui.sidebarPosition,
  )
  const infix = useInfix()
  const isMobile = infix < Infix.md

  // Navigation container class name
  const containerCln = !isMobile
    ? `${CONTAINER_CLN} sticky-menu`
    : CONTAINER_CLN
  const positionCln = sidebarPosition === 'right' && 'float-right'

  const concatCln = useMemo(() => {
    const nextContainerCln = [containerCln]
    if (positionCln) nextContainerCln.push(positionCln)
    return nextContainerCln.join(' ')
  }, [containerCln, positionCln])

  return (
    <div className={concatCln} style={{ gap, ...style }}>
      {children}
    </div>
  )
}

export default SentreLayout
