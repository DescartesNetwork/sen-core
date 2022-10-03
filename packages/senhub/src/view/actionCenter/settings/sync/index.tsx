import { useHistory } from 'react-router-dom'

import { Row, Col, Button, Card, Typography, Space } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { useRootDispatch, RootDispatch } from 'store'
import { setVisibleActionCenter } from 'store/ui.reducer'

const Sync = () => {
  const dispatch = useRootDispatch<RootDispatch>()
  const history = useHistory()

  return (
    <Card className="card-setting" hoverable bordered={false}>
      <Row gutter={[12, 12]}>
        <Col span={24}>
          <Space size={12}>
            <IonIcon
              style={{
                color: '#9E84F5',
                background: 'rgba(158, 132, 245, 0.1)',
              }}
              className="theme-icon"
              name="cloud-upload-outline"
            />
            <Typography.Text>Backup & Restore</Typography.Text>
          </Space>
        </Col>
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col span={12}>
              <Button
                type="primary"
                icon={<IonIcon name="cloud-done-outline" />}
                onClick={() => {
                  dispatch(setVisibleActionCenter(false))
                  history.push('/sync')
                }}
                block
              >
                Backup
              </Button>
            </Col>
            <Col span={12}>
              <Button
                icon={<IonIcon name="archive-outline" />}
                onClick={() => {
                  dispatch(setVisibleActionCenter(false))
                  history.push('/sync?cid=')
                }}
                block
              >
                Restore
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  )
}

export default Sync
