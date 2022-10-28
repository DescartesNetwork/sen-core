import { useMemo } from 'react'

import { Card, Col, Row } from 'antd'
import Brand from 'components/brand'
import Navigation from './navigation'
import System from './system'
import ButtonVisibleSideBar from './components/buttonVisible'

import { useInfix, useTheme } from 'hooks/useUI'
import { useGoToStore } from 'hooks/useGotoStore'
import { RootState, useRootSelector } from 'store'
import { Infix } from 'store/ui.reducer'
import { net } from 'shared/runtime'

import './index.os.less'

const SideBar = () => {
  const infix = useInfix()
  const visible = useRootSelector(({ ui }: RootState) => ui.visibleNavigation)
  const theme = useTheme()
  const goToStore = useGoToStore()

  const isMobile = useMemo(() => infix < Infix.md, [infix])
  const brandDirection = useMemo(
    () => (visible && !isMobile ? 'horizontal' : 'vertical'),
    [visible, isMobile],
  )
  const rowAlign = useMemo(
    () => (visible && !isMobile ? 'top' : 'middle'),
    [visible, isMobile],
  )

  return (
    <Card className="card-sidebar" bordered={false}>
      <Row className="wrapper-sidebar" gutter={[0, 12]}>
        <Col style={{ flex: '1 1' }}>
          <Row style={{ flexFlow: 'column', height: '100%' }} align={rowAlign}>
            <Col
              style={{
                paddingTop: 20,
                paddingBottom: 20,
                paddingLeft: 8,
                paddingRight: 8,
                flex: 'none',
              }}
            >
              <Brand
                style={{ cursor: 'pointer' }}
                network={net}
                theme={theme}
                direction={brandDirection}
                onClick={goToStore}
              />
            </Col>
            <Col style={{ width: '100%' }}>
              <Navigation isMobile={isMobile} />
            </Col>
          </Row>
        </Col>
        <Col style={{ marginBottom: 8 }}>
          <System isMobile={isMobile} />
        </Col>
      </Row>
      <ButtonVisibleSideBar />
    </Card>
  )
}

export default SideBar
