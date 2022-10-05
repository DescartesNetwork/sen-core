import { Row, Col, Switch, Typography, Card, Space } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import {
  useRootDispatch,
  useRootSelector,
  RootDispatch,
  RootState,
} from 'store'
import { setSidebarPosition } from 'store/ui.reducer'

const PositionSideBar = () => {
  const dispatch = useRootDispatch<RootDispatch>()
  const sidebarPosition = useRootSelector(
    (state: RootState) => state.ui.sidebarPosition,
  )

  const onSwitch = (checked: boolean) =>
    dispatch(setSidebarPosition(checked ? 'right' : 'left'))

  return (
    <Card className="card-setting" hoverable bordered={false}>
      <Row align="middle">
        <Col flex="auto">
          <Space size={12}>
            <IonIcon
              style={{
                color: '#F58662',
                background: 'rgba(245, 134, 98, 0.1)',
              }}
              className="theme-icon"
              name="list-outline"
            />
            <Space size={0} direction="vertical">
              <Typography.Text>The sidebar on the right</Typography.Text>
              <Typography.Text type="secondary" className="caption">
                Easier to control on mobile.
              </Typography.Text>
            </Space>
          </Space>
        </Col>
        <Col>
          <Switch
            size="default"
            onChange={onSwitch}
            checked={sidebarPosition === 'right'}
          />
        </Col>
      </Row>
    </Card>
  )
}

export default PositionSideBar
