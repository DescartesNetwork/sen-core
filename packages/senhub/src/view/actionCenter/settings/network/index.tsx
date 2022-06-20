import { useCallback, useState, useEffect } from 'react'
import { Connection } from '@solana/web3.js'

import { Row, Col, Typography, Space, Badge, Card } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import NetSwitch from './netSwitch'

import configs from 'configs'

const {
  sol: { node },
} = configs

// 0: Failed, 1: Poor, 2: Moderate, 3: Good
enum NetworkStatus {
  Failed,
  Poor,
  Moderate,
  Good,
}
let intervalId: ReturnType<typeof setTimeout> | undefined

/**
 * Ping Solana cluster
 * @param nodeRpc - Solana's RPC cluster
 * @returns ping time
 */
export const pingCluster = async (nodeRpc: string): Promise<number> => {
  const connection = new Connection(nodeRpc)
  const start = Date.now()
  await connection.getVersion()
  const end = Date.now()
  return end - start
}

const parseType = (status: NetworkStatus) => {
  switch (status) {
    case NetworkStatus.Good:
      return 'success'
    case NetworkStatus.Moderate:
      return 'warning'
    case NetworkStatus.Poor:
      return 'error'
    default:
      return 'default'
  }
}

const parseMessage = (status: number) => {
  switch (status) {
    case NetworkStatus.Good:
      return 'Good'
    case NetworkStatus.Moderate:
      return 'Moderate'
    case NetworkStatus.Poor:
      return 'Poor'
    default:
      return 'No'
  }
}

const Network = () => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>(
    NetworkStatus.Failed,
  )

  // Intervally ping solana cluster
  const ping = useCallback(async () => {
    try {
      if (!window.navigator.onLine)
        return setNetworkStatus(NetworkStatus.Failed)
      const duration = await pingCluster(node)
      if (duration < 250) return setNetworkStatus(NetworkStatus.Good)
      if (duration < 1000) return setNetworkStatus(NetworkStatus.Moderate)
      return setNetworkStatus(NetworkStatus.Poor)
    } catch (er) {
      return setNetworkStatus(NetworkStatus.Failed)
    }
  }, [])

  useEffect(() => {
    if (intervalId) clearInterval(intervalId)
    ping() // Init the network status
    intervalId = setInterval(ping, 1000)
    return () => {
      if (intervalId) clearInterval(intervalId)
      intervalId = undefined
    }
  }, [ping])

  return (
    <Card bodyStyle={{ padding: 16 }} hoverable bordered={false}>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Row gutter={[8, 8]} wrap={false} align="middle">
            <Col flex="auto">
              <Space>
                <IonIcon name="wifi-outline" />
                <Typography.Text>Solana Network</Typography.Text>
              </Space>
            </Col>
            <Col>
              <NetSwitch />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Space size={0}>
            <Badge status={parseType(networkStatus)} dot />
            <Typography.Text type="secondary">
              {`${parseMessage(networkStatus)} connection`}
            </Typography.Text>
          </Space>
        </Col>
      </Row>
    </Card>
  )
}

export default Network
