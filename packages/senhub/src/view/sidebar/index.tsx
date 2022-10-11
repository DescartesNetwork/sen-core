import { Card, Col, Row } from 'antd'
import Brand from 'components/brand'
import Navigation from './navigation'
import System from './system'
import ActionVisibleSideBar from './components/buttonVisibleSidebar'

import { useInfix, useTheme } from 'hooks/useUI'
import { RootState, useRootSelector } from 'store'
import { Infix } from 'store/ui.reducer'
import { net } from 'shared/runtime'

import './index.os.less'

const SideBar = () => {
  const infix = useInfix()
  const visible = useRootSelector(
    (state: RootState) => state.ui.visibleNavigation,
  )
  const theme = useTheme()

  const isMobile = infix < Infix.md
  const brandDirection = visible && !isMobile ? 'horizontal' : 'vertical'
  const rowAlign = visible && !isMobile ? 'top' : 'middle'

  return (
    <Card className="card-sidebar" bordered={false}>
      <Row className="wrapper-sidebar" gutter={[0, 12]}>
        <Col style={{ flex: '1 1' }}>
          <Row
            gutter={[8, 8]}
            style={{ flexFlow: 'column', height: '100%' }}
            align={rowAlign}
          >
            <Col
              style={{
                paddingTop: 20,
                paddingBottom: 20,
                paddingLeft: 12,
                paddingRight: 12,
              }}
            >
              <Brand network={net} theme={theme} direction={brandDirection} />
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
      <ActionVisibleSideBar />
    </Card>
  )
}

export default SideBar
