import { DEFAULT_SINGLE_FLIGHT_CONFIG, SingleFlightConfig } from './constant'

import { IRequestQueue, RequestQueue } from './request'
import { SingleFlightCache } from './cache'

export class DataLoader {
  static mapInstance = new Map<string, SingleFlight>()

  private static getSingleFlight(configs: SingleFlightConfig): SingleFlight {
    const instanceKey = JSON.stringify(configs)
    if (this.mapInstance.has(instanceKey)) {
      const instance = this.mapInstance.get(instanceKey)
      if (instance) return instance
    }

    let newSingleFlight = new SingleFlight(configs)
    this.mapInstance.set(instanceKey, newSingleFlight)
    return newSingleFlight
  }

  static async load<T>(
    requestKey: string | object,
    callback: () => Promise<T>,
    configs: SingleFlightConfig = {},
  ): Promise<T> {
    if (typeof requestKey === 'object') requestKey = JSON.stringify(requestKey)

    let singleFlight = DataLoader.getSingleFlight(configs)
    DataLoader.mapInstance.set(requestKey, singleFlight)
    const newRequest = new RequestQueue(requestKey)
    return singleFlight.load<T>(newRequest, callback)
  }
}

class SingleFlight {
  private config: SingleFlightConfig
  private intervalRequest: any
  private timeLogs: number[] = []

  private mapRequestCalling = new Map<string, IRequestQueue>()
  private requestQueue: IRequestQueue[] = []

  constructor(configs: SingleFlightConfig) {
    this.config = Object.assign(DEFAULT_SINGLE_FLIGHT_CONFIG, configs)
  }

  async load<T>(newRequest: IRequestQueue, callback: () => Promise<T>) {
    const cacheData = SingleFlightCache.get(newRequest.key)
    if (cacheData) return Promise.resolve(cacheData)

    let isFetch = false
    let request = this.mapRequestCalling.get(newRequest.key)
    if (!request) {
      request = newRequest
      isFetch = true
      this.mapRequestCalling.set(request.key, request)
    }

    return new Promise((resolve, reject) => {
      if (!request) return reject('Not found request!')
      request.add(resolve, reject)
      if (isFetch) {
        this.fetch<T>(request, callback)
      }
    })
  }

  private fetch<T>(request: IRequestQueue, callback: () => Promise<T>) {
    if (!this.validateLimit()) {
      return this.addRequestQueue(request, callback)
    }
    this.createTimeLogs()

    callback()
      .then((response) => {
        SingleFlightCache.set(request.key, response, this.config.cache)
        request.resolves(response)
      })
      .catch((error) => {
        request.rejects(error)
      })
      .finally(() => {
        this.mapRequestCalling.delete(request.key)
        this.fetchRequestQueue(callback)
      })
  }

  private fetchRequestQueue(callback: () => Promise<any>) {
    if (!this.validateLimit()) return
    const request = this.requestQueue.shift()
    if (request) this.load(request, callback)

    if (this.requestQueue.length === 0 && this.intervalRequest) {
      clearInterval(this.intervalRequest)
    }
  }

  private addRequestQueue(
    request: IRequestQueue,
    callback: () => Promise<any>,
  ) {
    this.requestQueue.push(request)
    this.intervalRequest = setInterval(() => {
      this.fetchRequestQueue(callback)
    }, this.config.limit?.time)
  }

  private validateLimit(): boolean {
    return true
  }

  private createTimeLogs() {
    if (!this.config.limit) return

    const now = new Date().getTime()
    this.timeLogs.push(now)
    if (this.timeLogs.length > this.config.limit?.calls) {
      this.timeLogs.shift()
    }
  }
}
