import { useCallback } from 'react'
import { useHistory, useParams } from 'react-router-dom'

export type AppRoute = {
  root: string
  to: (
    route: string,
    opts?: Partial<{
      absolutePath: boolean
      newWindow: boolean
    }>,
  ) => void
  extend: (
    subroute: string,
    opts?: Partial<{
      absolutePath: boolean
    }>,
  ) => string
  back: (fallbackRoute?: string) => void
}

export const useAppRoute = (appId?: string): AppRoute => {
  const history = useHistory()
  const { appId: defaultAppId } = useParams<{ appId: string }>()

  const root = `/app/${appId || defaultAppId}`
  const extend = useCallback<AppRoute['extend']>(
    (subroute, opts) => {
      const { absolutePath } = {
        absolutePath: false,
        ...opts,
      }
      if (!absolutePath) return root + subroute
      return '/app/:appId' + subroute
    },
    [root],
  )
  const to = useCallback<AppRoute['to']>(
    (route, opts) => {
      const { absolutePath, newWindow } = {
        absolutePath: false,
        newWindow: false,
        ...opts,
      }
      const open = newWindow
        ? (r: string) => window.open(r, '_blank')
        : history.push
      if (!absolutePath) return open(extend(route, { absolutePath: true }))
      return open(route)
    },
    [history, extend],
  )
  const back = useCallback<AppRoute['back']>(
    (fallbackRoute) => {
      if (history.action !== 'POP') return history.goBack()
      if (fallbackRoute) return to(fallbackRoute)
    },
    [history, to],
  )

  return { root, extend, to, back }
}
