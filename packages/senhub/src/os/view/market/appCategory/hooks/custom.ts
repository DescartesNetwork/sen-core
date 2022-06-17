export type RelatedCategory = {
  appIds?: AppIds
}

export type CategoryFilter = {
  authorEmail?: string
}

export const compareAliasString = (
  val: string,
  arr: string[] = [],
): boolean => {
  return arr.map((val) => val.toLowerCase()).includes(val.toLowerCase())
}

export const findTaggedApps = (tag: string, register: SenReg): AppIds => {
  const appIds: AppIds = Object.keys(register)
  return appIds.filter((appId) =>
    compareAliasString(tag, register[appId]?.tags),
  )
}

export const findSuggestedApps = (
  related: RelatedCategory,
  register: SenReg,
) => {
  if (!related.appIds) return []
  // Suggested by tags
  let appIds: AppIds = Object.keys(register)
  let suggestedTags: string[] = []
  for (const appId of related.appIds) {
    const additionalTags = register[appId]?.tags || []
    suggestedTags = Array.from(new Set([...suggestedTags, ...additionalTags]))
  }
  return appIds.filter((appId) => {
    if (related.appIds?.includes(appId)) return false
    for (const tag of suggestedTags)
      if (compareAliasString(tag, register[appId]?.tags)) return true
    return false
  })
}

export const filterApp = (
  register: SenReg,
  appIds: AppIds,
  { authorEmail }: CategoryFilter,
): AppIds => {
  return appIds.filter((appId) => {
    const { author } = register[appId] || {}
    return author?.email === authorEmail
  })
}
