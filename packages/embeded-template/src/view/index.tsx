import EmbededView from '@sentre/embeded-view'

import configs from 'configs'

const {
  manifest: { appId },
} = configs

const View = () => {
  return (
    <EmbededView
      appId={appId}
      src={'https://hub.sentre.io'}
      title="Please replace the src and title to your original DApp."
      wallet={window.sentre.wallet}
    />
  )
}

export default View
