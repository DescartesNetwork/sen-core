import { Row, Col, Switch, Typography, Card, Space } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import {
  useRootDispatch,
  useRootSelector,
  RootDispatch,
  RootState,
} from 'os/store'
import { setTheme } from 'os/store/ui.reducer'

const Theme = () => {
  const dispatch = useRootDispatch<RootDispatch>()
  const theme = useRootSelector((state: RootState) => state.ui.theme)

  const onSwitch = (checked: boolean) =>
    dispatch(setTheme(checked ? 'dark' : 'light'))

  return (
    <Card bodyStyle={{ padding: 16 }} hoverable bordered={false}>
      <Row gutter={[18, 18]}>
        <Col span={24}>
          <Row gutter={[8, 8]} wrap={false} align="middle">
            <Col flex="auto">
              <IonIcon
                name={theme === 'dark' ? 'moon-outline' : 'sunny-outline'}
              />
            </Col>
            <Col>
              <Switch
                size="small"
                checked={theme === 'dark'}
                onChange={onSwitch}
              />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Space direction="vertical" size={0}>
            <Typography.Text style={{ textTransform: 'capitalize' }}>
              {theme} theme
            </Typography.Text>
            <Typography.Paragraph
              type="secondary"
              style={{ fontSize: 12, margin: 0 }}
            >
              {theme === 'dark'
                ? "Dark mode will prolong your device's battery life, and reduce eye strain"
                : "Make graphics smoother, but might decrease your device's battery life"}
            </Typography.Paragraph>
          </Space>
        </Col>
      </Row>
    </Card>
  )
}

export default Theme
