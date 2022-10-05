/// <reference path="@types/index.ts" />

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
// export * from 'providers'
export { default as TokenProvider } from 'shared/tokenProvider'
export * from 'shared/tokenProvider'
export * from 'providers/antd.provider'
// PDB
export { default as PDB } from 'shared/pdb'
export * from 'shared/pdb'
// Runtime
export * from 'shared/runtime'
// Session/Storage
export { default as session } from 'shared/session'
export { default as storage } from 'shared/storage'
// Utility
export * as util from 'shared/util'
// Dataloader
export * from 'shared/dataloader'
// Hooks
export * from 'hooks/useRegister'
export * from 'hooks/useAppIds'
export * from 'hooks/useAppRoute'
export * from 'hooks/useGotoApp'
export * from 'hooks/useGotoStore'
export * from 'hooks/useInstallApp'
export * from 'hooks/useUninstallApp'
export * from 'hooks/useWallet'
export * from 'hooks/useAccounts'
export * from 'hooks/useMints'
export * from 'hooks/useUI'
