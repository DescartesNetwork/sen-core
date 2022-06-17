import { useCallback, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import {
  Button,
  Col,
  Image,
  Input,
  Modal,
  Row,
  Tooltip,
  Typography,
} from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import SuccessImg from 'os/static/images/backup/success.png'

const BackupSuccess = ({
  link,
  visible,
  onClose = () => {},
}: {
  link: string
  visible: boolean
  onClose?: () => void
}) => {
  const [copied, setCopied] = useState(false)

  const onCopy = useCallback(async () => {
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 1500)
  }, [])

  return (
    <Modal
      closable={false}
      centered
      visible={visible}
      maskClosable={false}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Row
        gutter={[20, 20]}
        align="middle"
        justify="center"
        style={{ textAlign: 'center' }}
      >
        <Col span={24}>
          <Image src={SuccessImg} preview={false} />
        </Col>
        <Col span={24}>
          <Typography.Title level={3}>Backup successfully</Typography.Title>
        </Col>
        <Col span={24}>
          <Input
            prefix={
              <Button
                type="text"
                size="small"
                style={{ marginLeft: -7 }}
                icon={<IonIcon name="link-outline" />}
              />
            }
            suffix={
              <Tooltip title="Copied" visible={copied}>
                <CopyToClipboard text={link} onCopy={onCopy}>
                  <Button
                    type="text"
                    size="small"
                    icon={<IonIcon name="copy-outline" />}
                  />
                </CopyToClipboard>
              </Tooltip>
            }
            value={link}
          />
        </Col>
        <Col span={24}>
          <CopyToClipboard text={link} onCopy={onCopy}>
            <Button type="primary" onClick={onClose}>
              {'Copy & Close'}
            </Button>
          </CopyToClipboard>
        </Col>
      </Row>
    </Modal>
  )
}

export default BackupSuccess
