import lunr, { Index } from 'lunr'

class SearchEngine {
  register: SenReg
  index: Index

  constructor(register: SenReg) {
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
    let appIds: string[] = []
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
