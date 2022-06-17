/// <reference path="./global.ts" />

import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { RootContext } from 'os/store/context'
import { QueryClient, QueryClientProvider } from 'react-query'

import { ConfigProvider } from 'antd'
import View from 'os/view'

import store from 'os/store'

/**
 * Mainboard
 */

const Senhub = () => (
  <Provider context={RootContext} store={store}>
    <BrowserRouter>
      <QueryClientProvider client={new QueryClient()}>
        <ConfigProvider prefixCls={'sentre'}>
          <View />
        </ConfigProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </Provider>
)

export default Senhub

/**
 * Minor libraries
 */

// Senhub providers
export * from 'os/providers'
// PDB
export { default as PDB } from 'shared/pdb'
export * from 'shared/pdb'
// Runtime
export * from 'shared/runtime'
// Session/Storage
export { default as session } from 'shared/session'
export { default as storage } from 'shared/storage'
// Embeded View
export { default as EmbededView } from 'shared/embededView'
export * from 'shared/embededView'
// Token Provider
export { default as TokenProvider } from 'shared/tokenProvider'
// Utility
export * as util from 'shared/util'
// Dataloader
export * from 'shared/dataloader'
