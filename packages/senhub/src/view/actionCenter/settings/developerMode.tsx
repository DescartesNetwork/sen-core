import { Row, Col, Switch, Typography, Card, Space } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import {
  useRootDispatch,
  useRootSelector,
  RootDispatch,
  RootState,
} from 'store'
import { updateDeveloperMode } from 'store/flags.reducer'

const DeveloperMode = () => {
  const dispatch = useRootDispatch<RootDispatch>()
  const developerMode = useRootSelector(
    (state: RootState) => state.flags.developerMode,
  )

  const onSwitch = (checked: boolean) => dispatch(updateDeveloperMode(checked))

  return (
    <Card bodyStyle={{ padding: 16 }} hoverable bordered={false}>
      <Row gutter={[18, 18]}>
        <Col span={24}>
          <Row gutter={[8, 8]} wrap={false} align="middle">
            <Col flex="auto">
              <IonIcon name="bug-outline" />
            </Col>
            <Col>
              <Switch
                size="small"
                checked={developerMode}
                onChange={onSwitch}
              />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Space direction="vertical" size={0}>
            <Typography.Text style={{ textTransform: 'capitalize' }}>
              Developer Mode
            </Typography.Text>
            <Typography.Paragraph
              type="secondary"
              style={{ fontSize: 12, margin: 0 }}
            >
              Unverified DApps may harm your device. If you ain't a dev, disable
              it.
            </Typography.Paragraph>
          </Space>
        </Col>
      </Row>
    </Card>
  )
}

export default DeveloperMode
