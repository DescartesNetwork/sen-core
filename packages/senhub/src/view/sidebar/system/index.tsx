import { Col, Divider, Row } from 'antd'
import MenuItem from '../menuItem'
import SenMarket from './market'
import IonIcon from '@sentre/antd-ionicon'

import { MenuSystemItem } from '../index'
import { useWalletAddress } from 'hooks/useWallet'
import { isAddress } from 'shared/util'
import { RootState, useRootSelector } from 'store'

const System = () => {
  const visible = useRootSelector((state: RootState) => state.sidebar.visible)
  const walletAddress = useWalletAddress()

  const rowAlign = visible ? 'stretch' : 'middle'

  return (
    <Row gutter={[12, 12]} style={{ flexFlow: 'column' }} align={rowAlign}>
      {isAddress(walletAddress) && (
        <Col>
          <MenuItem
            value={MenuSystemItem.AppSettings}
            onClick={() => {}}
            name={visible}
          >
            {MenuSystemItem.AppSettings}
          </MenuItem>
        </Col>
      )}
      <Col>
        <MenuItem
          icon={<IonIcon name="notifications-outline" />}
          value={MenuSystemItem.Notify}
          onClick={() => {}}
          name={visible}
        >
          {MenuSystemItem.Notify}
        </MenuItem>
      </Col>
      <Col>
        <Divider style={{ margin: 0 }} type="horizontal" />
      </Col>
      <Col>
        <SenMarket />
      </Col>
    </Row>
  )
}

export default System
