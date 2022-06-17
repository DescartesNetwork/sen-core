const KEY = 'sentre'
const driver = window.sessionStorage

const convert = (value: string | null) => {
  try {
    if (!value) return null
    return JSON.parse(value)
  } catch (e) {
    return false
  }
}

const session = {
  set: (key: string, value: any) => {
    let data = convert(driver.getItem(KEY))
    if (!data || typeof data !== 'object') data = {}
    data[key] = value
    driver.setItem(KEY, JSON.stringify(data))
  },

  get: (key: string) => {
    let data = convert(driver.getItem(KEY))
    if (!data || typeof data !== 'object') return null
    return data[key]
  },

  clear: (key: string) => {
    session.set(key, null)
  },
}

export default session
