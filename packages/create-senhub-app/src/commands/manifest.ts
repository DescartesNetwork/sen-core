import { Command, Flags } from '@oclif/core'
import fs from 'fs-extra'
import path from 'path'
import { format } from 'prettier'
import { config } from 'dotenv-cra'

export const buildManifest = async ({
  inDir = process.cwd(),
  outDir = process.cwd(),
}: {
  inDir?: string
  outDir?: string
}) => {
  const env = process.env.NODE_ENV
  const { parsed } = config({ env, path: path.resolve(inDir, `.env`) })
  if (!fs.existsSync(path.resolve(inDir, `.env.${env}`)) || !parsed)
    throw new Error(`Cannot find the file env.${env}`)

  const {
    REACT_APP_ID,
    REACT_APP_NAME,
    REACT_APP_AUTHOR_NAME,
    REACT_APP_AUTHOR_EMAIL,
    REACT_APP_TAGS,
    REACT_APP_URL,
    REACT_APP_DESCRIPTION,
  } = parsed

  // Validate author
  if (!REACT_APP_AUTHOR_NAME)
    throw new Error("Invalid author name. The author's name cannot be blank!")
  if (!REACT_APP_AUTHOR_EMAIL)
    throw new Error("Invalid author email. The author's email cannot be blank!")

  // Validate description
  if (!REACT_APP_DESCRIPTION)
    throw new Error('Invalid description. Description cannot be blank!')

  // Validate app name
  if (!REACT_APP_NAME)
    throw new Error('Invalid App name. App name cannot be blank!')

  // Validate app ID
  const expectedAppID = REACT_APP_NAME.toLowerCase().replace(/ /g, '_')
  if (!REACT_APP_ID) throw new Error('Invalid AppID. AppID cannot be blank!')
  if (expectedAppID !== REACT_APP_ID)
    throw new Error(
      `Invalid AppID. The expected AppID is '${expectedAppID}' with App Name '${REACT_APP_NAME}'.`,
    )
  if (/\W/g.test(REACT_APP_ID))
    throw new Error(
      "Invalid AppID. AppID can't contain any special characters.",
    )

  // Validate URL
  if (!REACT_APP_URL) throw new Error('Invalid Github. Github cannot be blank!')

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
  const outPath = path.resolve(outDir, fileName)

  const text = await format(JSON.stringify(manifest), {
    trailingComma: 'all',
    tabWidth: 2,
    semi: false,
    singleQuote: true,
    printWidth: 80,
    parser: 'json',
  })

  fs.writeFileSync(outPath, text)
  return outPath
}

export default class Manifest extends Command {
  static description =
    'Generate the manifest file of the application, which is to submit your application to Sentre Hub.'

  static examples = ['<%= config.bin %> <%= command.id %>']

  static flags = {
    inDir: Flags.string({
      char: 'i',
      description: 'The directory to your project.',
    }),
    outDir: Flags.string({
      char: 'o',
      description: 'The directory to output the manifest file.',
    }),
  }

  static args = [
    {
      name: 'env',
      description:
        'The NODE_ENV to generate a corresponding manifest. Default: production.',
      options: ['development', 'staging', 'production'],
      default: 'production',
    },
  ]

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Manifest)

    const { env } = args
    const { inDir, outDir } = flags

    const origEnv = process.env.NODE_ENV
    try {
      process.env.NODE_ENV = env
      const outPath = await buildManifest({ inDir, outDir })
      return this.log(
        '\n🎉 Completely build the manifest. Check here out:',
        outPath,
      )
    } catch (er: any) {
      return this.error(er.message)
    } finally {
      process.env.NODE_ENV = origEnv
    }
  }
}
