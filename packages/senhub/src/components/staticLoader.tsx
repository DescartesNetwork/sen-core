import { Suspense, forwardRef, cloneElement, useCallback, useMemo } from 'react'
import { RemoteModule } from '@sentre/react-dynamic-remote-component'
import useSWR from 'swr'

import { Spin } from 'antd'
import ErrorBoundary from 'components/errorBoundary'

import { REGISTER_APP_STORE } from 'view/marketplace'
import { useRegisterSelector } from 'hooks/useRegister'

const ONE_HOUR = 60 * 60 * 1000

/**
 * Remote Static
 */
type StaticType = 'logo' | 'readme'
type MultiStaticType = 'panels'

/**
 * Load asset json
 */
const useRemoteStatic = ({ url, scope }: RemoteModule): any => {
  const fetchAsset = useCallback(
    async (appId) => {
      const root = url.replace('index.js', '')
      const prefix = (asset: string | string[]) => {
        if (typeof asset === 'string') return root + asset
        if (Array.isArray(asset)) return asset.map((value) => root + value)
        throw new Error('Invalid static asset')
      }
      const res = await fetch(root + `${appId}-asset-senhub.json`)
      const data = await res.json()
      Object.keys(data).forEach((key) => (data[key] = prefix(data[key])))
      return data
    },
    [url],
  )
  const { data } = useSWR(scope, fetchAsset, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
    dedupingInterval: ONE_HOUR,
  })
  return data || {}
}

const RemoteStatic = forwardRef<
  HTMLElement,
  {
    type?: StaticType
    manifest: RemoteModule
    render: (src: string) => JSX.Element
  }
>(({ type = 'default', manifest, render }, ref) => {
  const { [type]: src } = useRemoteStatic(manifest)
  return cloneElement(render(src), ref ? { ref } : {})
})
RemoteStatic.displayName = 'RemoteStatic'

/**
 * Static Loader
 */
export const StaticLoader = forwardRef<
  HTMLElement,
  {
    appId: string
    type: StaticType
    defaultData?: string
    render: (url: string) => JSX.Element
  }
>(({ type, appId, defaultData = '', render }, ref) => {
  const { url: appUrl } =
    useRegisterSelector((register) => register[appId]) || {}
  const url = useMemo(
    () => appUrl || REGISTER_APP_STORE[appId]?.url || '',
    [appUrl, appId],
  )
  const manifest: RemoteModule = useMemo(
    () => ({ url, scope: appId, module: './static' }),
    [url, appId],
  )

  if (!url) return null
  return (
    <ErrorBoundary defaultChildren={render(defaultData)}>
      <Suspense fallback={<Spin size="small" />}>
        <RemoteStatic
          type={type}
          manifest={manifest}
          render={render}
          ref={ref}
        />
      </Suspense>
    </ErrorBoundary>
  )
})
StaticLoader.displayName = 'StaticLoader'

/**
 * Remote Multi Statics
 */
const RemoteMultiStatic = forwardRef<
  HTMLElement,
  {
    type?: MultiStaticType
    manifest: RemoteModule
    render: (src: string[]) => JSX.Element
  }
>(({ type = 'default', manifest, render }, ref) => {
  const { [type]: arrSrc } = useRemoteStatic(manifest)
  return cloneElement(render(arrSrc || []), ref ? { ref } : {})
})
RemoteMultiStatic.displayName = 'RemoteMultiStatic'

/**
 * Remote Multi Loader
 */
export const MultiStaticLoader = forwardRef<
  HTMLElement,
  {
    appId: string
    type: MultiStaticType
    defaultData?: string[]
    render: (url: string[]) => JSX.Element
  }
>(({ type, appId, defaultData = [''], render }, ref) => {
  const { url: appUrl } =
    useRegisterSelector((register) => register[appId]) || {}
  const url = useMemo(() => appUrl || '', [appUrl, appId])
  const manifest: RemoteModule = useMemo(
    () => ({ url, scope: appId, module: './static' }),
    [url, appId],
  )

  if (!url) return null
  return (
    <ErrorBoundary defaultChildren={render(defaultData)}>
      <Suspense fallback={<Spin size="small" />}>
        <RemoteMultiStatic
          type={type}
          manifest={manifest}
          render={render}
          ref={ref}
        />
      </Suspense>
    </ErrorBoundary>
  )
})
MultiStaticLoader.displayName = 'MultiStaticLoader'
