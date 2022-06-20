import { ChangeEvent, useState, useEffect } from 'react'
import fileDownload from 'js-file-download'
import { keystore as ks, Keystore } from '@senswap/sen-js'

import { Row, Col, Button, Typography, Input, Modal } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

const NewKeyStore = ({
  visible = false,
  onClose = () => {},
}: {
  visible: boolean
  onClose: () => void
}) => {
  const [password, setPassword] = useState('')
  const [keystore, setKeystore] = useState<Keystore | null>(null)

  useEffect(() => {
    setPassword('')
    setKeystore(null)
  }, [visible])
  useEffect(() => {
    setKeystore(ks.gen(password))
  }, [password])

  const onDownload = () => {
    if (!keystore)
      return window.notify({
        type: 'error',
        description: 'Cannot download a empty keystore',
      })
    fileDownload(
      JSON.stringify(keystore),
      `senwallet-keystore-${keystore.publicKey}.json`,
    )
    return onClose()
  }

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      closeIcon={<IonIcon name="close" />}
      footer={null}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Typography.Title>New Keystore</Typography.Title>
          <Typography.Text>
            The password is used to encrypt your keystore. You will need this
            password to unlock your keystore later.
          </Typography.Text>
        </Col>
        <Col span={24}>
          <Input.Password
            placeholder="Password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value || '')
            }
            iconRender={(visible) =>
              visible ? <IonIcon name="eye-off" /> : <IonIcon name="eye" />
            }
          />
        </Col>
        <Col span={24}>
          <Row gutter={[16, 16]} justify="end">
            <Col>
              <Button
                type="primary"
                icon={<IonIcon name="cloud-download" />}
                onClick={onDownload}
                disabled={!keystore || !keystore.publicKey}
              >
                Download
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Modal>
  )
}

export default NewKeyStore
