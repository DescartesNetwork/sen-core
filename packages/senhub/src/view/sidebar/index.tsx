import { Card, Col, Row } from 'antd'
import Brand from 'components/brand'
import Navigation from './navigation'
import System from './system'
import ActionVisibleSideBar from './components/buttonVisibleSidebar'

import { useInfix } from 'hooks/useUI'
import { RootState, useRootSelector } from 'store'
import { Infix } from 'store/ui.reducer'

import './index.os.less'

export enum MenuSystemItem {
  Notify = 'Notifications',
  AppSettings = 'Application settings',
  AddApp = 'Add more app',
}

const SideBar = () => {
  const infix = useInfix()
  const visible = useRootSelector((state: RootState) => state.sidebar.visible)

  const isMobile = infix < Infix.md
  const brandDirection = visible && !isMobile ? 'horizontal' : 'vertical'
  const defaultSideBarCln = isMobile
    ? 'card-sidebar sb-mobile'
    : 'card-sidebar sb-desk'
  const sidebarCln = visible ? `${defaultSideBarCln} active` : defaultSideBarCln
  const rowAlign = visible && !isMobile ? 'start' : 'center'

  return (
    <Card className={sidebarCln} bordered={false}>
      <Row className="wrapper-sidebar" gutter={[0, 24]}>
        <Col>
          <Row gutter={[24, 28]} justify={rowAlign}>
            <Col>
              <Brand direction={brandDirection} />
            </Col>
            <Col span={24}>
              <Navigation isMobile={isMobile} />
            </Col>
          </Row>
        </Col>
        <Col>
          <System isMobile={isMobile} />
        </Col>
      </Row>
      <ActionVisibleSideBar />
    </Card>
  )
}

export default SideBar
