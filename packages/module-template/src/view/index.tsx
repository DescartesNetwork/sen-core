import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useWalletAddress, tokenProvider, rpc } from '@sentre/senhub'

import { Row, Col, Typography, Button, Space } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { AppDispatch, AppState } from 'model'
import { increaseCounter } from 'model/main.controller'

import { programs } from '@metaplex/js'
import { Connection } from '@solana/web3.js'

async function test() {
  const tokenMetadata = await programs.metadata.Metadata.findByMint(
    new Connection(rpc),
    'xALGoH1zUfRmpCriy94qbfoMXHtK6NDnMKzT4Xdvgms',
  )
  console.log('tokenMetadata', tokenMetadata)
}
test()

const View = () => {
  const walletAddress = useWalletAddress()
  const dispatch = useDispatch<AppDispatch>()
  const counter = useSelector((state: AppState) => state.main.counter)

  const increase = useCallback(() => dispatch(increaseCounter()), [dispatch])

  return (
    <Row gutter={[24, 24]} align="middle">
      <Col span={24}>
        <Space align="center">
          <IonIcon name="newspaper-outline" />
          <Typography.Title level={4}>App View</Typography.Title>
        </Space>
      </Col>
      <Col span={24}>
        <Typography.Text>Address: {walletAddress}</Typography.Text>
      </Col>
      <Col>
        <Typography.Text>Counter: {counter}</Typography.Text>
      </Col>
      <Col>
        <Button onClick={increase}>Increase</Button>
      </Col>
    </Row>
  )
}

export default View
