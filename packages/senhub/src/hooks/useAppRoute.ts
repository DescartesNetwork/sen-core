import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'

export type AppRoute = {
  root: string
  to: (
    route: string,
    opts?: Partial<{
      absolutePath: boolean
      newWindow: boolean
    }>,
  ) => void
  extend: (subroute: string) => string
  back: (fallbackRoute?: string) => void
}

export const useAppRoute = (appId: string): AppRoute => {
  const history = useHistory()

  const root = `/app/${appId}`
  const extend = useCallback<AppRoute['extend']>(
    (subroute) => root + subroute,
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
      if (!absolutePath) return open(extend(route))
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
