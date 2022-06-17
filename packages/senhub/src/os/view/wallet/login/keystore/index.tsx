import { ChangeEvent, useRef, useState } from 'react'

import { Row, Col, Space, Button, Typography, Input } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import NewKeyStore from './newKeystore'

import { useRootDispatch, RootDispatch } from 'os/store'
import { connectWallet } from 'os/store/wallet.reducer'
import { KeystoreWallet } from '../../lib'

const KeyStore = () => {
  const [password, setPassword] = useState('')
  const [filename, setFilename] = useState('')
  const [keystore, setKeystore] = useState(null)
  const [visible, setVisible] = useState(false)

  const refFile = useRef<HTMLInputElement>(null)
  const dispatch = useRootDispatch<RootDispatch>()

  const onKeystore = (e: ChangeEvent<HTMLInputElement>) => {
    const [file]: any = e?.target?.files
    if (file) {
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onloadend = () => {
        setFilename(file.name)
        setKeystore(JSON.parse(reader.result as string) || {})
      }
    }
  }

  const connect = async () => {
    if (!keystore)
      return window.notify({
        type: 'warning',
        description: 'Please upload your keystore',
      })
    if (!password)
      return window.notify({
        type: 'warning',
        description: 'Please enter your password to unlock your wallet',
      })
    try {
      const wallet = new KeystoreWallet(keystore as any, password)
      await dispatch(connectWallet(wallet)).unwrap()
    } catch (er: any) {
      return window.notify({ type: 'error', description: er.message })
    }
  }

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Space align="center">
          <IonIcon name="document-lock" />
          <Typography.Text>
            {`Keystore ( `}
            <Typography.Link
              href="https://solflare.com"
              target="_blank"
              rel="noopener"
            >
              SolFlare
            </Typography.Link>{' '}
            {`compatible )`}
          </Typography.Text>
        </Space>
      </Col>
      <Col xs={{ span: 24 }} md={{ span: 12 }}>
        <Input
          placeholder="Filename"
          value={filename}
          suffix={
            <Button
              type="text"
              icon={<IonIcon name="cloud-upload" />}
              style={{ marginRight: -8 }}
              onClick={() => refFile.current?.click()}
            >
              Upload
            </Button>
          }
          readOnly
        />
        <input
          ref={refFile}
          type="file"
          accept="application/json"
          onChange={onKeystore}
          style={{ display: 'none' }}
        />
      </Col>
      <Col xs={{ span: 24 }} md={{ span: 12 }}>
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value || '')
          }
          suffix={
            <Button
              type="primary"
              onClick={connect}
              icon={<IonIcon name="lock-open" />}
              style={{ marginRight: -8 }}
            />
          }
        />
      </Col>
      <Col span={24} style={{ marginTop: -8 }}>
        <Typography.Link onClick={() => setVisible(true)}>
          <Space>
            <IonIcon name="add-circle-outline" />
            <span>Create a keystore</span>
          </Space>
        </Typography.Link>
      </Col>
      <NewKeyStore visible={visible} onClose={() => setVisible(false)} />
    </Row>
  )
}

export default KeyStore
