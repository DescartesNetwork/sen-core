import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'

import { Col, Row, Tabs } from 'antd'
import Backup from './backup'
import Restore from './restore'

const Sync = () => {
  const { search } = useLocation()
  const [key, setKey] = useState('backup')

  useEffect(() => {
    const cid = new URLSearchParams(search).get('cid')
    if (typeof cid === 'string') setKey('restore')
    else setKey('backup')
  }, [search])

  return (
    <Row justify="center">
      <Col>
        <Tabs
          activeKey={key}
          onChange={setKey}
          style={{ overflow: 'visible' }}
          destroyInactiveTabPane
        >
          <Tabs.TabPane tab="Backup" key="backup">
            <Backup />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Restore" key="restore">
            <Restore />
          </Tabs.TabPane>
        </Tabs>
      </Col>
    </Row>
  )
}
export default Sync
