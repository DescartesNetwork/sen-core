import { Card, Col, Row } from 'antd'
import Brand from 'components/brand'
import Navigation from './navigation'
import System from './system'
import ActionVisibleSideBar from './components/buttonVisibleSidebar'

import { RootState, useRootSelector } from 'store'
import './index.os.less'

export enum MenuSystemItem {
  Notify = 'Notifications',
  AppSettings = 'Application settings',
  AddApp = 'Add more app',
}

const SideBar = () => {
  const visible = useRootSelector((state: RootState) => state.sidebar.visible)
  const brandDirection = visible ? 'horizontal' : 'vertical'
  const sidebarCln = visible ? 'card-sidebar active' : 'card-sidebar'
  const rowAlign = visible ? 'start' : 'center'

  return (
    <Card className={sidebarCln} bordered={false}>
      <Row className="wrapper-sidebar" gutter={[0, 24]}>
        <Col>
          <Row gutter={[24, 28]} justify={rowAlign}>
            <Col>
              <Brand direction={brandDirection} />
            </Col>
            <Col span={24}>
              <Navigation />
            </Col>
          </Row>
        </Col>
        <Col>
          <System />
        </Col>
      </Row>
      <ActionVisibleSideBar />
    </Card>
  )
}

export default SideBar
