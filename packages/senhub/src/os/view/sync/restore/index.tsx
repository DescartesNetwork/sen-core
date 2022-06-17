import { useState, ChangeEvent, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { Row, Col, Button, Input, Card } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import JsonViewer from 'os/components/jsonViewer'
import ConfirmRestore from './confirm'

import { useRootSelector, RootState } from 'os/store'
import PDB from 'shared/pdb'
import IPFS from 'shared/pdb/ipfs'

const Restore = () => {
  const [link, setLink] = useState('')
  const [cid, setCID] = useState('')
  const [data, setData] = useState({})
  const { search } = useLocation()
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const walletAddress = useRootSelector(
    (state: RootState) => state.wallet.address,
  )

  // Parse link
  useEffect(() => {
    const params = new URLSearchParams(search)
    const cid = params.get('cid')
    if (IPFS.isCID(cid)) setLink(window.location.href)
  }, [search])
  // Parse CID
  useEffect(() => {
    try {
      const params = new URLSearchParams(new URL(link).search)
      return setCID(params.get('cid') as string)
    } catch (er) {
      return setCID('')
    }
  }, [link])
  // Parse data
  useEffect(() => {
    ;(async () => {
      if (!IPFS.isCID(cid)) return setData({})
      await setLoading(true)
      const pdb = new PDB(walletAddress)
      const data = await pdb.fetch(cid)
      await setData(data)
      return setLoading(false)
    })()
  }, [walletAddress, cid])

  return (
    <Row style={{ maxWidth: 520 }}>
      <Col span={24}>
        <Card bordered={false}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Input
                placeholder="https://hub.sentre.io/sync?cid=..."
                prefix={
                  <Button
                    type="text"
                    size="small"
                    style={{ marginLeft: -7 }}
                    icon={<IonIcon name="link-outline" />}
                  />
                }
                value={link}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setLink(e.target.value || '')
                }
              />
            </Col>
            <Col span={24}>
              <JsonViewer value={data} />
            </Col>
            <Col span={24}>
              <Button
                type="primary"
                icon={<IonIcon name="push-outline" />}
                onClick={() => setVisible(true)}
                disabled={!IPFS.isCID(cid)}
                block
                loading={loading}
              >
                Restore
              </Button>
            </Col>
          </Row>
        </Card>
      </Col>
      <ConfirmRestore
        visible={visible}
        onClose={() => setVisible(false)}
        cid={cid}
      />
    </Row>
  )
}

export default Restore
