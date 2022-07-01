import { useCallback, useState } from 'react'
import copy from 'copy-to-clipboard'

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

import SuccessImg from 'static/images/backup/success.png'
import { asyncWait } from 'shared/util'

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

  const visibleCopied = useCallback(async () => {
    setCopied(true)
    await asyncWait(1500)
    setCopied(false)
  }, [])

  const onCopy = useCallback(
    async (text: string, cb: () => void = () => {}) => {
      copy(text)
      return cb()
    },
    [],
  )

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
                <Button
                  type="text"
                  size="small"
                  icon={<IonIcon name="copy-outline" />}
                  onClick={() => onCopy(link, visibleCopied)}
                />
              </Tooltip>
            }
            value={link}
          />
        </Col>
        <Col span={24}>
          <Button type="primary" onClick={() => onCopy(link, onClose)}>
            {'Copy & Close'}
          </Button>
        </Col>
      </Row>
    </Modal>
  )
}

export default BackupSuccess
