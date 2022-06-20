import { Suspense, forwardRef, useCallback, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  RemoteModule,
  useRemoteModule,
} from '@sentre/react-dynamic-remote-component'

import { Row, Col, Typography, Button, Skeleton } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import ErrorBoundary from 'components/errorBoundary'

import { RootDispatch, useRootDispatch } from 'store'
import { setBackground } from 'store/ui.reducer'

/**
 * Remote component
 */
const RemoteComponent = forwardRef<HTMLElement, { manifest: RemoteModule }>(
  ({ manifest, ...props }, ref) => {
    const { Page: Component } = useRemoteModule(manifest)
    return <Component {...props} ref={ref} />
  },
)

/**
 * Error Component
 */
const PageError = ({ url = 'Unknown' }: { url?: string }) => {
  const retry = () => window.location.reload()
  const support = useCallback(() => {
    return window.open(
      `mailto:hi@sentre.io?subject=${url} has failed`,
      '_blank',
    )
  }, [url])

  return (
    <Row
      gutter={[8, 8]}
      style={{ height: '100%' }}
      align="middle"
      justify="center"
    >
      <Col span={24}>
        <Typography.Title level={4} style={{ textAlign: 'center' }}>
          {url}
        </Typography.Title>
      </Col>
      <Col span={24}>
        <p style={{ textAlign: 'center' }}>
          Oops! The application can't load properly.
        </p>
      </Col>
      <Col span={12}>
        <Button type="text" onClick={support} block>
          Support
        </Button>
      </Col>
      <Col span={12}>
        <Button
          type="primary"
          onClick={retry}
          icon={<IonIcon name="reload-outline" />}
          block
        >
          Retry
        </Button>
      </Col>
    </Row>
  )
}

/**
 * Page Loader
 */
const PageLoader = forwardRef<HTMLElement, ComponentManifest>(
  ({ url, appId, ...props }, ref) => {
    const manifest = { url, scope: appId, module: './bootstrap' }
    const dispatch = useRootDispatch<RootDispatch>()
    const { pathname } = useLocation()
    const currentAppId = pathname.split('/')[2]

    // We have to watch on the current appId to check mount/unmount events.
    useEffect(() => {
      // Mount executions
      document.title = `${props.name} | Sentre Hub`
      // Unmount executions inside the return
      return () => {
        if (!currentAppId) return
        dispatch(setBackground({ light: '', dark: '' }))
        document.title = 'Sentre Hub'
      }
    }, [dispatch, currentAppId, props.name])

    return (
      <ErrorBoundary defaultChildren={<PageError url={url} />}>
        <Suspense fallback={<Skeleton active />}>
          <RemoteComponent manifest={manifest} {...props} ref={ref} />
        </Suspense>
      </ErrorBoundary>
    )
  },
)

export default PageLoader
