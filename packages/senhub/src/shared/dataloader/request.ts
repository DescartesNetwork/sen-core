export interface IRequestQueue {
  key: string
  add(resolve: any, reject: any): void
  resolves(data: any): void
  rejects(error: any): void
}

export class RequestQueue implements IRequestQueue {
  key = ''
  private resolveQueue: any[] = []
  private rejectQueue: any[] = []
  constructor(key: string) {
    this.key = key
  }

  add(resolve: any, reject: any) {
    this.resolveQueue.push(resolve)
    this.rejectQueue.push(reject)
  }

  resolves(data: any) {
    while (this.resolveQueue.length > 0) {
      const resolve = this.resolveQueue.shift()
      resolve(data)
    }
  }

  rejects(error: any) {
    while (this.rejectQueue.length > 0) {
      const reject = this.rejectQueue.shift()
      reject(error)
    }
  }
}
