import { useEffect } from 'react'
import { Gateway } from '@sentre/connector'

export type EmbededViewProps = {
  appId: string
  src: string
  title: string
}

const EmbededView = ({ appId, src, title }: EmbededViewProps) => {
  // Setup wallet gateway
  useEffect(() => {
    const gateway = new Gateway(window.sentre.wallet)
    return gateway.terminate
  }, [])

  return (
    <iframe
      id={appId + '-iframe'}
      src={src}
      title={title}
      style={{
        height: 'calc(100vh - 64px)',
        margin: -12,
        marginTop: -24,
        border: 'none',
        width: '100vw',
      }}
      loading="lazy"
      allowFullScreen
    />
  )
}

export default EmbededView
