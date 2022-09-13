import lunr, { Index } from 'lunr'
import { RegisterState } from 'store/register.reducer'

class SearchEngine {
  register: RegisterState
  index: Index

  constructor(register: RegisterState) {
    this.register = register
    this.index = lunr(function () {
      // Document id
      this.ref('appId')
      // Indexed document
      this.field('appId')
      this.field('name')
      this.field('description')
      this.field('tags')
      this.field('author:name', {
        extractor: (doc: any) => doc?.author?.name || '',
      })
      this.field('author:email', {
        extractor: (doc: any) => doc?.author?.email || '',
      })
      // Data
      Object.keys(register).forEach((appId: string) => {
        const appManifest = register[appId]
        if (appManifest) this.add(appManifest)
      })
    })
  }

  search = (keyword: string, limit = 10) => {
    const appIds: string[] = []
    if (!keyword) return []
    const fuzzy = `*${keyword}*`
    this.index.search(fuzzy).forEach(({ ref }) => {
      if (!appIds.includes(ref)) return appIds.push(ref)
    })
    return appIds
      .map((appId) => (this.register[appId] as ComponentManifest).appId)
      .slice(0, limit)
  }
}

export default SearchEngine
