/// <reference path="./global.ts" />

import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'

import { ConfigProvider } from 'antd'
import View from 'view'

import store from 'store'
import { RootContext } from 'store/context'

/**
 * Mainboard
 */

const Senhub = () => (
  <Provider context={RootContext} store={store}>
    <BrowserRouter>
      <ConfigProvider prefixCls={'sentre'}>
        <View />
      </ConfigProvider>
    </BrowserRouter>
  </Provider>
)

export default Senhub

/**
 * Minor libraries
 */

// Senhub providers
export * from 'providers'
// PDB
export { default as PDB } from 'shared/pdb'
export * from 'shared/pdb'
// Runtime
export * from 'shared/runtime'
// Session/Storage
export { default as session } from 'shared/session'
export { default as storage } from 'shared/storage'
// Token Provider
export { default as TokenProvider } from 'shared/tokenProvider'
// Utility
export * as util from 'shared/util'
// Dataloader
export * from 'shared/dataloader'
