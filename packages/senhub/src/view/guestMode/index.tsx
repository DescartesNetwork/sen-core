import { CSSProperties, useCallback, useMemo, useState } from 'react'

import { Button, Card, Col, Row, Space, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { RootDispatch, useRootDispatch } from 'store'
import { openWallet } from 'store/wallet.reducer'
import { useWalletAddress } from 'hooks/useWallet'
import { isGuestAddress } from 'shared/util'
import { useAppSide, useAppWidth } from 'hooks/useUI'

const GuestMode = () => {
  const [position, setPosition] = useState<'bottom' | 'top'>('bottom')
  const dispatch = useRootDispatch<RootDispatch>()
  const walletAddress = useWalletAddress()
  const width = useAppWidth()
  const side = useAppSide()

  const onConnectWallet = useCallback(() => dispatch(openWallet()), [dispatch])
  const onPosition = useCallback(
    () => setPosition(position === 'bottom' ? 'top' : 'bottom'),
    [position],
  )

  const style: CSSProperties = useMemo(
    () => ({
      width: width - 24,
      position: 'fixed',
      visibility: isGuestAddress(walletAddress) ? 'visible' : 'hidden',
      [side]: 12,
      [position]: 12,
    }),
    [walletAddress, side, position, width],
  )
  const iconName = useMemo(
    () =>
      position === 'bottom' ? 'chevron-up-outline' : 'chevron-down-outline',
    [position],
  )

  return (
    <div style={style}>
      <Card bodyStyle={{ padding: 12 }} bordered={false} hoverable>
        <Row gutter={[12, 12]} wrap={false} align="middle">
          <Col flex="auto">
            <Space>
              <IonIcon
                style={{ color: '#f9575e', fontSize: 20 }}
                name="information-circle-outline"
              />
              <Typography.Text>
                In the Guest Mode, some functions are restricted. Please{' '}
                <span style={{ color: '#f9575e', fontWeight: 900 }}>
                  DO NOT
                </span>{' '}
                send tokens to Guest Wallet.
              </Typography.Text>
            </Space>
          </Col>
          <Col>
            <Button type="primary" onClick={onConnectWallet}>
              Remove Restriction
            </Button>
          </Col>
          <Col>
            <Button
              type="text"
              icon={<IonIcon name={iconName} />}
              onClick={onPosition}
            />
          </Col>
        </Row>
      </Card>
    </div>
  )
}

export default GuestMode
