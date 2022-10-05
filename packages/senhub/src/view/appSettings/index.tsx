import { Col, Drawer, Row, Typography } from 'antd'
import WidgetLayout from './widgetLayout'

import './index.os.less'

type AppSettingsProps = { open?: boolean; onClose?: (value: boolean) => void }
const AppSettings = ({
  open = false,
  onClose = () => {},
}: AppSettingsProps) => {
  return (
    <Drawer
      open={open}
      onClose={() => onClose(false)}
      closeIcon={false}
      className="app-settings-drawer"
    >
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Typography.Title level={4}>Application settings</Typography.Title>
        </Col>
        <Col span={24}>
          <WidgetLayout />
        </Col>
      </Row>
    </Drawer>
  )
}

export default AppSettings
