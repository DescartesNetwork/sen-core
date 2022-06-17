import { DEFAULT_CACHE_CONFIG } from './constant'
import { CacheConfig } from './constant'

export class SingleFlightCache {
  private static mapCache = new Map<string, any>()

  static set(
    key: string,
    value: any,
    configs: CacheConfig = DEFAULT_CACHE_CONFIG,
  ) {
    this.mapCache.set(key, value)
    setTimeout(() => {
      this.mapCache.delete(key)
    }, configs.ttl)
  }

  static get(key: string) {
    return this.mapCache.get(key)
  }
}
