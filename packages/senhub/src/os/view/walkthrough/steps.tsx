import { ReactNode } from 'react'
import { Step } from 'react-joyride'

import { Typography } from 'antd'

export const step = ({
  content,
  target,
  title,
}: {
  content: ReactNode
  target: string
  title: string
}) => {
  return {
    content,
    disableBeacon: true,
    disableOverlayClose: true,
    spotlightClicks: true,
    styles: {
      options: {
        zIndex: 10000,
      },
    },
    target,
    title: <Typography.Title level={5}>{title}</Typography.Title>,
  }
}

export const DEFAULT_STEPS: Step[] = []

export const NEWCOMER_STEPS: Step[] = [
  step({
    content: (
      <Typography.Text>
        Click the <b>Store</b> button to explore the numerous DeFi applications.
      </Typography.Text>
    ),
    target: '#store-nav-button',
    title: 'Search an app',
  }),
  step({
    content: (
      <Typography.Text>
        Find an application in the list and click the <b>Install</b> button to
        set up the application.
      </Typography.Text>
    ),
    target: '#install-action-button',
    title: 'Install an app',
  }),
  step({
    content: (
      <Typography.Text>
        Click the <b>Open</b> button to explore more interesting features.
      </Typography.Text>
    ),
    target: '#open-action-button',
    title: 'Open the app',
  }),
]
