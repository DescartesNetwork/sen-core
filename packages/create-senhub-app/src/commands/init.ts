import { Command, Flags, CliUx } from '@oclif/core'
import tmp from 'tmp'
import fs from 'fs-extra'
import path from 'path'
import { execSync } from 'child_process'
import { clone, rmrf } from '../util'

export default class Init extends Command {
  static description = 'Init a template of DApp on Senhub.'

  static examples = ['<%= config.bin %> <%= command.id %> my-dapp']

  static flags = {
    template: Flags.string({
      char: 't',
      description: 'Template for the new DApp.',
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
    // Start
    CliUx.ux.action.start('Building the project', 'initializing', {
      stdout: true,
    })
    // Set up
    const tmpobj = tmp.dirSync()
    const tmpDir = tmpobj.name
    // Clone the Sen Core
    await clone({
      dir: tmpDir,
      url: 'https://github.com/DescartesNetwork/sen-core',
    })
    const templateDir = path.resolve(tmpDir, `./packages/${template}-template`)
    const dir = path.resolve(process.cwd(), name)
    // Init the project directory
    if (fs.existsSync(name) && !force)
      return this.error(
        `The project ${name} that already existed. Please retry with another name!`,
      )
    else await rmrf(name)
    fs.copySync(templateDir, dir)
    // Install deps
    execSync('yarn install', {
      cwd: dir,
      stdio: 'inherit',
    })
    // End
    CliUx.ux.action.stop()
  }
}
