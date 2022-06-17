const fs = require('fs')
const prettier = require('prettier')
const {
  parsed: {
    REACT_APP_ID,
    REACT_APP_NAME,
    REACT_APP_AUTHOR_NAME,
    REACT_APP_AUTHOR_EMAIL,
    REACT_APP_TAGS,
    REACT_APP_URL,
    REACT_APP_DESCRIPTION,
  },
} = require('dotenv-cra').config()

// Color console log
const RED_BACKGROUND = '\x1b[41m'
const GREEN_TEXT = '\x1b[32m'
const BLUE_TEXT = '\x1b[34m'
const YELLOW_TEXT = '\x1b[33m'
const DEFAULT_TEXT = '\x1b[0m'

function logError(error) {
  console.log('❌❌❌', RED_BACKGROUND, error, DEFAULT_TEXT, '❌❌❌')
  console.log(
    '\n✨✨ Reference ✨✨:',
    YELLOW_TEXT,
    ' https://docs.sentre.io/senhub/dapp-information\n',
    DEFAULT_TEXT,
  )
  console.log('🌟🌟 Edit file:', BLUE_TEXT, '.env.local\n', DEFAULT_TEXT)
}

function main() {
  // Validate author
  if (!REACT_APP_AUTHOR_NAME)
    return logError(`Invalid author name. The author's name cannot be blank!`)
  if (!REACT_APP_AUTHOR_EMAIL)
    return logError(`Invalid author email. The author's email cannot be blank!`)

  // Validate description
  if (!REACT_APP_DESCRIPTION)
    return logError(`Invalid description. Description cannot be blank!`)

  // Validate app name
  if (!REACT_APP_NAME)
    return logError(`Invalid App name. App name cannot be blank!`)

  // Validate app ID
  const expectedAppID = REACT_APP_NAME.toLowerCase().replace(/ /g, '_')
  if (!REACT_APP_ID) return logError(`Invalid AppID. AppID cannot be blank!`)
  if (expectedAppID !== REACT_APP_ID)
    return logError(
      `Invalid AppID. The expected AppID is '${expectedAppID}' with App Name '${REACT_APP_NAME}'.`,
    )
  if (/\W/g.test(REACT_APP_ID))
    return logError(
      `Invalid AppID. AppID can't contain any special characters.`,
    )

  // Validate URL
  if (!REACT_APP_URL) return logError(`Invalid Github. Github cannot be blank!`)

  const manifest = {
    url: REACT_APP_URL,
    appId: REACT_APP_ID,
    name: REACT_APP_NAME,
    author: {
      name: REACT_APP_AUTHOR_NAME,
      email: REACT_APP_AUTHOR_EMAIL,
    },
    tags: (REACT_APP_TAGS || '')
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag),
    description: REACT_APP_DESCRIPTION,
    verified: false,
  }

  const fileName = `${REACT_APP_ID}.manifest.json`
  prettier
    .resolveConfigFile()
    .then((configFile) => {
      return prettier.resolveConfig(configFile)
    })
    .then((options) => {
      return prettier.format(JSON.stringify(manifest, null, 2), {
        ...options,
        parser: 'json',
      })
    })
    .then((text) => {
      fs.writeFileSync(fileName, text)
      return console.log(
        GREEN_TEXT,
        '\n👏👏 Completely built a manifest. Check it out ==>',
        BLUE_TEXT,
        `./${fileName}`,
        DEFAULT_TEXT,
      )
    })
    .catch((er) => {
      throw new Error(er)
    })
}

// Run main
main()
