import { useCallback, useState } from 'react'

import { Button, Card, Checkbox, Col, Row } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import BackupSuccess from './backupSuccess'
import ReviewManual from './reviewManual'
import ReviewData from './reviewData'

import PDB from 'shared/pdb'
import { useWalletAddress } from 'hooks/useWallet'

const Backup = () => {
  const [link, setLink] = useState('')
  const [acceptable, setAcceptable] = useState(false)
  const [visible, setVisible] = useState(false)
  const walletAddress = useWalletAddress()

  const onBackup = useCallback(async () => {
    const pdb = new PDB(walletAddress)
    const cid = await pdb.backup()
    await setLink(`${window.location.origin}/sync?cid=${cid}`)
    return setVisible(true)
  }, [walletAddress])

  return (
    <Row style={{ maxWidth: 520 }}>
      <Col span={24}>
        <Card bordered={false}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <ReviewManual />
            </Col>
            <Col span={24}>
              <ReviewData />
            </Col>
            <Col span={24}>
              <Checkbox
                checked={acceptable}
                onChange={() => setAcceptable(!acceptable)}
              >
                I have read and understood
              </Checkbox>
            </Col>
            <Col span={24}>
              <Button
                disabled={!acceptable}
                type="primary"
                block
                icon={<IonIcon name="cloud-upload-outline" />}
                onClick={onBackup}
              >
                Generate a backup link
              </Button>
            </Col>
          </Row>
        </Card>
      </Col>
      <BackupSuccess
        visible={visible}
        link={link}
        onClose={() => setVisible(false)}
      />
    </Row>
  )
}

export default Backup
