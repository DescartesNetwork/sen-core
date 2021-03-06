import { Command, Flags } from '@oclif/core'
import path from 'path'

export default class Publish extends Command {
  static description =
    'Publish your applications to Sentre Hub. The manifest file will be automatically generated with production mode.'

  static examples = ['<%= config.bin %> <%= command.id %>']

  static flags = {
    directory: Flags.string({
      char: 'd',
      description:
        'The directory to the manifest file. Default option will automatically search the manifest file in the current directory.',
      default: (() => {
        const { name } = require(`${path.resolve(
          process.cwd(),
          './package.json',
        )}`)
        if (!name)
          throw new Error(
            'Cannot file package.json. You must stay at root directory of your project, or your can use the --directory option.',
          )
        return path.resolve(process.cwd(), `./${name}.manifest.json`)
      })(),
    }),
  }

  static args = []

  public async run(): Promise<void> {
    const { flags } = await this.parse(Publish)

    const { directory } = flags
    this.log('Your manifest file:', directory)
  }
}
