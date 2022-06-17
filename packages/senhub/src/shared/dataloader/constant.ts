export type LimitConfig = {
  calls: number
  time: number
}

export type CacheConfig = {
  ttl: number // millisecond
}

export type SingleFlightConfig = {
  limit?: LimitConfig
  cache?: CacheConfig
}

// 10 request per 1 second
export const DEFAULT_LIMIT_CONFIG: LimitConfig = {
  calls: 10,
  time: 1000,
}

// 10 request per 1 second
export const DEFAULT_CACHE_CONFIG: CacheConfig = {
  ttl: 30000,
}

export const DEFAULT_SINGLE_FLIGHT_CONFIG: SingleFlightConfig = {
  limit : DEFAULT_LIMIT_CONFIG,
  cache: DEFAULT_CACHE_CONFIG
}