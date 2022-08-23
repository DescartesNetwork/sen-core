import { ReactNode } from 'react'

import { ConfigProvider } from 'antd'
import { ConfigProviderProps } from 'antd/lib/config-provider'

export type AntdProviderProps = {
  appId: string
} & ConfigProviderProps

/**
 * Confid provider to AntD
 * Ref: https://ant.design/components/config-provider/
 * @param props.appId
 * @param props.config
 * @returns
 */
export const AntdProvider = ({
  children,
  appId,
  ...config
}: AntdProviderProps) => {
  return (
    <ConfigProvider
      getPopupContainer={() => document.getElementById(appId) as HTMLElement}
      {...config}
    >
      {children}
    </ConfigProvider>
  )
}
