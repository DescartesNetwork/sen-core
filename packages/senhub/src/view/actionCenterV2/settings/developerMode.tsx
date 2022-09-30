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
    <Card className="card-setting" hoverable bordered={false}>
      <Row align="middle">
        <Col flex="auto">
          <Space size={12}>
            <IonIcon
              style={{ color: '#F9575E', background: 'rgba(249, 87, 94, 0.1)' }}
              className="theme-icon"
              name="bug-outline"
            />
            <Space size={0} direction="vertical">
              <Typography.Text>Developer mode</Typography.Text>
              <Typography.Text type="secondary" className="caption">
                Show unverified apps.
              </Typography.Text>
            </Space>
          </Space>
        </Col>
        <Col>
          <Switch size="default" checked={developerMode} onChange={onSwitch} />
        </Col>
      </Row>
    </Card>
  )
}

export default DeveloperMode
