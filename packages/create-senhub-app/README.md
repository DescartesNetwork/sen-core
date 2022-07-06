# create-senhub-app

The official CLI to init a template of DApp on Senhub

[![Version](https://img.shields.io/npm/v/create-senhub-app.svg)](https://npmjs.org/package/create-senhub-app)
[![Downloads/week](https://img.shields.io/npm/dw/create-senhub-app.svg)](https://npmjs.org/package/create-senhub-app)
[![License](https://img.shields.io/npm/l/create-senhub-app.svg)](https://github.com/DescartesNetwork/sen-core/blob/main/package.json)

<!-- toc -->
* [create-senhub-app](#create-senhub-app)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g create-senhub-app
$ create-senhub-app COMMAND
running command...
$ create-senhub-app (--version)
create-senhub-app/3.0.37 darwin-x64 node-v18.3.0
$ create-senhub-app --help [COMMAND]
USAGE
  $ create-senhub-app COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`create-senhub-app help [COMMAND]`](#create-senhub-app-help-command)
* [`create-senhub-app init [PROJECT-NAME]`](#create-senhub-app-init-project-name)
* [`create-senhub-app manifest [ENV]`](#create-senhub-app-manifest-env)
* [`create-senhub-app publish`](#create-senhub-app-publish)

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
  -t, --template=<option>  [default: module] Template for the new DApp.
                           <options: module|embeded>

DESCRIPTION
  Init a template of DApp on Senhub.

EXAMPLES
  $ create-senhub-app init my-dapp
```

_See code: [dist/commands/init.ts](https://github.com/tuphan-dn/sen-core/blob/v3.0.37/dist/commands/init.ts)_

## `create-senhub-app manifest [ENV]`

Generate the manifest file of the application, which is to submit your application to Sentre Hub.

```
USAGE
  $ create-senhub-app manifest [ENV] [-i <value>] [-o <value>]

ARGUMENTS
  ENV  (development|staging|production) [default: production] The NODE_ENV to generate a corresponding manifest.
       Default: production.

FLAGS
  -i, --inDir=<value>   The directory to your project.
  -o, --outDir=<value>  The directory to output the manifest file.

DESCRIPTION
  Generate the manifest file of the application, which is to submit your application to Sentre Hub.

EXAMPLES
  $ create-senhub-app manifest
```

_See code: [dist/commands/manifest.ts](https://github.com/tuphan-dn/sen-core/blob/v3.0.37/dist/commands/manifest.ts)_

## `create-senhub-app publish`

Publish your applications to Sentre Hub. The manifest file will be automatically generated with production mode.

```
USAGE
  $ create-senhub-app publish [-d <value>]

FLAGS
  -d, --directory=<value>  [default:
                           /Users/tuphan/Desktop/core/packages/create-senhub-app/create-senhub-app.manifest.json] The
                           directory to the manifest file. Default option will automatically search the manifest file in
                           the current directory.

DESCRIPTION
  Publish your applications to Sentre Hub. The manifest file will be automatically generated with production mode.

EXAMPLES
  $ create-senhub-app publish
```

_See code: [dist/commands/publish.ts](https://github.com/tuphan-dn/sen-core/blob/v3.0.37/dist/commands/publish.ts)_
<!-- commandsstop -->
