import { Provider } from 'react-redux'
import { WalletProvider, UIProvider } from '@sentre/senhub'

import View from 'app/view'

import model from 'app/model'
import configs from 'app/configs'

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

export * from 'app/static.app'
