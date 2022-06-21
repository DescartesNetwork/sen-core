import { Command, Flags, CliUx } from '@oclif/core'
import fs from 'fs'
import path from 'path'
import { clone, rmrf } from '../util'

export default class Init extends Command {
  static description = 'Init a template of DApp on Senhub.'

  static examples = ['<%= config.bin %> <%= command.id %> my-app']

  static flags = {
    template: Flags.string({
      char: 't',
      description: 'Template for the new DApp',
      options: ['module', 'embeded'],
      default: 'module',
    }),
    force: Flags.boolean({
      char: 'f',
      description:
        'Overwrite existing directory. All files in the curent directory will be deleted.',
      default: false,
    }),
  }

  static args = [
    {
      name: 'project-name',
      require: true,
      description: 'Your project name',
    },
  ]

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Init)

    const { 'project-name': name } = args
    const { template, force } = flags

    this.log('\n👏👏👏 Welcome Sentizen!\n')
    CliUx.ux.action.start('Building the project', 'initializing', {
      stdout: true,
    })
    console.log(name, force)
    if (fs.existsSync(name) && !force)
      return this.error(
        `The project ${name} that already existed. Please retry with another name!`,
      )
    else await rmrf(name)
    const dir = path.join(process.cwd(), name)
    await clone({
      dir,
      url: 'https://github.com/DescartesNetwork/senreg',
    })

    CliUx.ux.action.stop()
  }
}
