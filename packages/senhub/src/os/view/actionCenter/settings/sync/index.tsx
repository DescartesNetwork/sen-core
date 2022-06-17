import { useHistory } from 'react-router-dom'

import { Row, Col, Button, Card, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { useRootDispatch, RootDispatch } from 'os/store'
import { setVisibleActionCenter } from 'os/store/ui.reducer'

const Sync = () => {
  const dispatch = useRootDispatch<RootDispatch>()
  const history = useHistory()

  return (
    <Card bodyStyle={{ padding: 16 }} hoverable bordered={false}>
      <Row gutter={[16, 22]}>
        <Col span={24}>
          <Typography.Text>Backup & Restore</Typography.Text>
        </Col>
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col span={24}>
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
            <Col span={24}>
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
