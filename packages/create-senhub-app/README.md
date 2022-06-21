# create-senhub-app

The official CLI to init a template of DApp on Senhub

[![Version](https://img.shields.io/npm/v/create-senhub-app.svg)](https://npmjs.org/package/create-senhub-app)
[![Downloads/week](https://img.shields.io/npm/dw/create-senhub-app.svg)](https://npmjs.org/package/create-senhub-app)
[![License](https://img.shields.io/npm/l/create-senhub-app.svg)](https://github.com/DescartesNetwork/sen-core/blob/main/package.json)

<!-- toc -->

- [Usage](#usage)
- [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->

```bash
npx create-senhub-app init my-dapp
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`create-senhub-app help [COMMAND]`](#create-senhub-app-help-command)
- [`create-senhub-app init [PROJECT-NAME]`](#create-senhub-app-init-project-name)
- [`create-senhub-app publish [FILE]`](#create-senhub-app-publish-file)

## `create-senhub-app help [COMMAND]`

Display help for create-senhub-app.

```
USAGE
  $ create-senhub-app help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for create-senhub-app.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.12/src/commands/help.ts)_

## `create-senhub-app init [PROJECT-NAME]`

Init a template of DApp on Senhub.

```
USAGE
  $ create-senhub-app init [PROJECT-NAME] [-t module|embeded] [-f]

ARGUMENTS
  PROJECT-NAME  Your project name

FLAGS
  -f, --force              Overwrite existing directory. All files in the curent directory will be deleted.
  -t, --template=<option>  [default: module] Template for the new DApp
                           <options: module|embeded>

DESCRIPTION
  Init a template of DApp on Senhub.

EXAMPLES
  $ create-senhub-app init my-app
```

_See code: [dist/commands/init.ts](https://github.com/tuphan-dn/sen-core/blob/v3.0.11/dist/commands/init.ts)_

## `create-senhub-app publish [FILE]`

describe the command here

```
USAGE
  $ create-senhub-app publish [FILE] [-n <value>] [-f]

FLAGS
  -f, --force
  -n, --name=<value>  name to print

DESCRIPTION
  describe the command here

EXAMPLES
  $ create-senhub-app publish
```

_See code: [dist/commands/publish.ts](https://github.com/tuphan-dn/sen-core/blob/v3.0.11/dist/commands/publish.ts)_

<!-- commandsstop -->
