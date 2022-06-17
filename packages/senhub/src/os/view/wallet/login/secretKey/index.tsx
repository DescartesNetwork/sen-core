import { ChangeEvent, useState } from 'react'
import { account } from '@senswap/sen-js'

import { Row, Col, Typography, Input, Button, Space } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { useRootDispatch, RootDispatch } from 'os/store'
import { connectWallet } from 'os/store/wallet.reducer'
import { SecretKeyWallet } from '../../lib'

const SecretKey = () => {
  const [secretKey, setSecretKey] = useState('')
  const dispatch = useRootDispatch<RootDispatch>()

  const connect = async () => {
    if (!secretKey)
      return window.notify({
        type: 'warning',
        description: 'Please enter your secret key',
      })
    const wallet = new SecretKeyWallet(secretKey)
    try {
      await dispatch(connectWallet(wallet)).unwrap()
    } catch (er: any) {
      return window.notify({ type: 'error', description: er.message })
    }
  }

  const onGen = () => {
    const acc = account.createAccount()
    const secretKey = Buffer.from(acc.secretKey).toString('hex')
    return setSecretKey(secretKey)
  }

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Space align="center">
          <IonIcon name="key" />
          <Typography.Text>Secret Key</Typography.Text>
        </Space>
      </Col>
      <Col span={24}>
        <Input
          placeholder="Secret Key"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSecretKey(e.target.value || '')
          }
          value={secretKey}
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
        <Typography.Link onClick={onGen}>
          <Space>
            <IonIcon name="add-circle-outline" />
            <span>Create a secret key</span>
          </Space>
        </Typography.Link>
      </Col>
    </Row>
  )
}

export default SecretKey
