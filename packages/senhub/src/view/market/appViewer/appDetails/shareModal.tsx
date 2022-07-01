import { useCallback, useMemo, useState } from 'react'
import copy from 'copy-to-clipboard'

import {
  Button,
  Col,
  Image,
  Input,
  Row,
  Space,
  Tooltip,
  Typography,
  Modal,
} from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { useRootSelector, RootState } from 'store'
import { asyncWait } from 'shared/util'
import Telegram from 'static/images/social/telegram.png'
import Twitter from 'static/images/social/twitter.png'

export type ShareModalProps = {
  appId: string
  shareWith: string
  visible: boolean
  onClose: () => void
}

const ShareModal = ({
  appId,
  shareWith,
  visible,
  onClose,
}: ShareModalProps) => {
  const [copied, setCopied] = useState(false)
  const register = useRootSelector((state: RootState) => state.page.register)

  const { name } = useMemo(
    () => register[appId] || ({} as ComponentManifest),
    [register, appId],
  )

  const onShare = useCallback(
    (url?: string) => {
      const params: Record<string, string> = {
        url: window.location.href,
        text: name || '',
      }
      for (const prop in params)
        url += '&' + prop + '=' + encodeURIComponent(params[prop] || '')
      window.open(
        url,
        '_blank',
        'left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0',
      )
    },
    [name],
  )
  const onClick = useCallback(
    (type?: string) => {
      let telegramURL = 'https://telegram.me/share/url?'
      let twitterURL = 'http://twitter.com/intent/tweet?'
      if (type === 'twitter') return onShare(twitterURL)
      return onShare(telegramURL)
    },
    [onShare],
  )
  const onCopy = useCallback(async (text: string) => {
    copy(text)
    setCopied(true)
    await asyncWait(1500)
    return setCopied(false)
  }, [])

  const shareLogo = useMemo(() => {
    if (shareWith === 'twitter') return Twitter
    return Telegram
  }, [shareWith])

  return (
    <Modal
      closable={false}
      visible={visible}
      onCancel={() => onClose()}
      closeIcon={<IonIcon name="close" />}
      footer={null}
      centered
      bodyStyle={{ padding: 32 }}
    >
      <Row gutter={[20, 20]} justify="center" style={{ textAlign: 'center' }}>
        <Col>
          <Image src={shareLogo} preview={false} style={{ width: 56 }} />
        </Col>
        <Col span={24}>
          <Typography.Title level={3}>Share this application</Typography.Title>
          <Typography.Text>Copy your link or share now!</Typography.Text>
        </Col>
        <Col span={16}>
          <Input
            suffix={
              <Tooltip title="Copied" visible={copied}>
                <Button
                  type="text"
                  size="small"
                  icon={<IonIcon name="copy-outline" />}
                  onClick={() => onCopy(window.location.href)}
                />
              </Tooltip>
            }
            value={window.location.href}
          />
        </Col>
        <Col>
          <Space>
            <Button className="btn-share" onClick={() => onClose()}>
              Cancel
            </Button>
            <Button
              type="primary"
              className="btn-share"
              onClick={() => onClick(shareWith)}
            >
              Share now
            </Button>
          </Space>
        </Col>
      </Row>
    </Modal>
  )
}

export default ShareModal
