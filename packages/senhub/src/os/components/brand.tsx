import { CSSProperties } from 'react'

import { Net } from 'shared/runtime'

import mainnet_horizontal_light from 'os/static/images/brand/mainnet-horizontal-light-sen.svg'
import mainnet_horizontal_dark from 'os/static/images/brand/mainnet-horizontal-dark-sen.svg'
import mainnet_vertical_light from 'os/static/images/brand/mainnet-vertical-light-sen.svg'
import mainnet_vertical_dark from 'os/static/images/brand/mainnet-vertical-dark-sen.svg'
import testnet_horizontal_light from 'os/static/images/brand/testnet-horizontal-light-sen.svg'
import testnet_horizontal_dark from 'os/static/images/brand/testnet-horizontal-dark-sen.svg'
import testnet_vertical_light from 'os/static/images/brand/testnet-vertical-light-sen.svg'
import testnet_vertical_dark from 'os/static/images/brand/testnet-vertical-dark-sen.svg'
import devnet_horizontal_light from 'os/static/images/brand/devnet-horizontal-light-sen.svg'
import devnet_horizontal_dark from 'os/static/images/brand/devnet-horizontal-dark-sen.svg'
import devnet_vertical_light from 'os/static/images/brand/devnet-vertical-light-sen.svg'
import devnet_vertical_dark from 'os/static/images/brand/devnet-vertical-dark-sen.svg'

const LOGO = {
  mainnet_horizontal_light,
  mainnet_horizontal_dark,
  mainnet_vertical_light,
  mainnet_vertical_dark,
  testnet_horizontal_light,
  testnet_horizontal_dark,
  testnet_vertical_light,
  testnet_vertical_dark,
  devnet_horizontal_light,
  devnet_horizontal_dark,
  devnet_vertical_light,
  devnet_vertical_dark,
}

export type BrandProps = {
  style?: CSSProperties
  network?: Net
  direction?: 'horizontal' | 'vertical'
  theme?: 'light' | 'dark'
  onClick?: () => void
}

const Brand = ({
  style = {},
  network = 'mainnet',
  direction = 'horizontal',
  theme = 'light',
  onClick = () => {},
}: BrandProps) => {
  const name = `${network}_${direction}_${theme}` as keyof typeof LOGO
  const logo = LOGO[name]
  return <img src={logo} style={style} alt={name} onClick={onClick} />
}

export default Brand
