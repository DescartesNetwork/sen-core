import { Select } from 'antd'

import { net, onSwitchNetwork } from 'shared/runtime'

const NetSwitch = () => {
  return (
    <Select defaultValue={net} onChange={onSwitchNetwork} size="small">
      <Select.Option value="devnet">Devnet</Select.Option>
      <Select.Option value="testnet" disabled>
        Testnet
      </Select.Option>
      <Select.Option value="mainnet">Mainnet</Select.Option>
    </Select>
  )
}

export default NetSwitch
