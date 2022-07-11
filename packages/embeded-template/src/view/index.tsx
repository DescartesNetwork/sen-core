import EmbededView from '@sentre/embeded-view'

import configs from 'configs'

const {
  manifest: { appId },
} = configs

const View = () => {
  return (
    <EmbededView
      appId={'sypool'}
      src={'https://app.sypool.io/'}
      title="Please replace the src and title to your original DApp."
      wallet={window.sentre.wallet}
    />
  )
}

export default View
