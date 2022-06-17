import { useCallback, useEffect, useMemo, useState } from 'react'

import { useRootSelector, RootState } from 'os/store'
import {
  CategoryFilter,
  RelatedCategory,
  filterApp,
  findSuggestedApps,
  findTaggedApps,
} from './custom'

export enum CustomCategory {
  suggest = 'for-you',
}

export type CategoryOptions = {
  category: string
  defaultTitle?: string
  related?: RelatedCategory
  filter?: CategoryFilter
}

export const useAppCategory = ({
  category,
  defaultTitle = '',
  related,
  filter,
}: CategoryOptions) => {
  const register = useRootSelector((state: RootState) => state.page.register)
  const [appIds, setAppIds] = useState<AppIds>([])

  const title = useMemo(() => {
    if (defaultTitle) return defaultTitle
    return category.replace(/\W/g, ' ')
  }, [category, defaultTitle])

  /**
   * find all app with CategoryData with case:
   * suggest-for-you: find all apps related to other apps
   * others: find all apps without tags
   * default: filter apps with tags
   */
  const findApps = useCallback(async () => {
    let appIds: AppIds = []
    switch (category) {
      case CustomCategory.suggest:
        appIds = findSuggestedApps(related || {}, register)
        break
      default:
        appIds = findTaggedApps(category, register)
        break
    }
    if (filter) appIds = filterApp(register, appIds, filter)
    return setAppIds(appIds)
  }, [register, category, related, filter])

  useEffect(() => {
    findApps()
  }, [findApps])

  return {
    title,
    appIds,
  }
}
