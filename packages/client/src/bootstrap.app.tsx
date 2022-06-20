import { Provider } from 'react-redux'
import { WalletProvider, UIProvider } from '@sentre/senhub'

import View from 'view'

import model from 'model'
import configs from 'configs'

const {
  manifest: { appId },
} = configs

export const Page = () => {
  return (
    <UIProvider appId={appId} antd>
      <WalletProvider>
        <Provider store={model}>
          <View />
        </Provider>
      </WalletProvider>
    </UIProvider>
  )
}

export * from 'static.app'
