import { Row, Col, Switch, Card, Space, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import {
  useRootDispatch,
  useRootSelector,
  RootDispatch,
  RootState,
} from 'store'
import { setTheme } from 'store/ui.reducer'

const Theme = () => {
  const dispatch = useRootDispatch<RootDispatch>()
  const theme = useRootSelector((state: RootState) => state.ui.theme)

  const onSwitch = (checked: boolean) =>
    dispatch(setTheme(checked ? 'dark' : 'light'))

  return (
    <Card className="card-setting" hoverable bordered={false}>
      <Row align="middle">
        <Col flex="auto">
          <Space size={12}>
            <IonIcon
              style={{ color: '#7398f0' }}
              className="theme-icon"
              name="moon-outline"
            />
            <Space size={0} direction="vertical">
              <Typography.Text>Dark mode</Typography.Text>
              <Typography.Text type="secondary" className="caption">
                Reduce eye strain.
              </Typography.Text>
            </Space>
          </Space>
        </Col>
        <Col>
          <Switch
            size="default"
            checked={theme === 'dark'}
            onChange={onSwitch}
          />
        </Col>
      </Row>
    </Card>
  )
}

export default Theme
