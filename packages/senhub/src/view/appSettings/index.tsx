import { Col, Drawer, Row, Typography } from 'antd'
import Settings from './settings'

import { RootState, useRootSelector } from 'store'

import './index.os.less'

type AppSettingsProps = { open?: boolean; onClose?: (value: boolean) => void }
const AppSettings = ({
  open = false,
  onClose = () => {},
}: AppSettingsProps) => {
  const sidebarPosition = useRootSelector(
    (state: RootState) => state.ui.sidebarPosition,
  )
  return (
    <Drawer
      open={open}
      onClose={() => onClose(false)}
      closeIcon={false}
      className="app-settings-drawer"
      contentWrapperStyle={{ width: 378 }}
      bodyStyle={{ padding: '24px 0px' }}
      placement={sidebarPosition}
    >
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Typography.Title className="padding-x" level={4}>
            Application settings
          </Typography.Title>
        </Col>
        <Col span={24}>
          <Settings />
        </Col>
      </Row>
    </Drawer>
  )
}

export default AppSettings
