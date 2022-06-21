oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
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
create-senhub-app/3.0.11 darwin-x64 node-v18.3.0
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
* [`create-senhub-app plugins`](#create-senhub-app-plugins)
* [`create-senhub-app plugins:install PLUGIN...`](#create-senhub-app-pluginsinstall-plugin)
* [`create-senhub-app plugins:inspect PLUGIN...`](#create-senhub-app-pluginsinspect-plugin)
* [`create-senhub-app plugins:install PLUGIN...`](#create-senhub-app-pluginsinstall-plugin-1)
* [`create-senhub-app plugins:link PLUGIN`](#create-senhub-app-pluginslink-plugin)
* [`create-senhub-app plugins:uninstall PLUGIN...`](#create-senhub-app-pluginsuninstall-plugin)
* [`create-senhub-app plugins:uninstall PLUGIN...`](#create-senhub-app-pluginsuninstall-plugin-1)
* [`create-senhub-app plugins:uninstall PLUGIN...`](#create-senhub-app-pluginsuninstall-plugin-2)
* [`create-senhub-app plugins update`](#create-senhub-app-plugins-update)
* [`create-senhub-app publish [FILE]`](#create-senhub-app-publish-file)

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

## `create-senhub-app plugins`

List installed plugins.

```
USAGE
  $ create-senhub-app plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ create-senhub-app plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.0.11/src/commands/plugins/index.ts)_

## `create-senhub-app plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ create-senhub-app plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ create-senhub-app plugins add

EXAMPLES
  $ create-senhub-app plugins:install myplugin 

  $ create-senhub-app plugins:install https://github.com/someuser/someplugin

  $ create-senhub-app plugins:install someuser/someplugin
```

## `create-senhub-app plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ create-senhub-app plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ create-senhub-app plugins:inspect myplugin
```

## `create-senhub-app plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ create-senhub-app plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ create-senhub-app plugins add

EXAMPLES
  $ create-senhub-app plugins:install myplugin 

  $ create-senhub-app plugins:install https://github.com/someuser/someplugin

  $ create-senhub-app plugins:install someuser/someplugin
```

## `create-senhub-app plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ create-senhub-app plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLES
  $ create-senhub-app plugins:link myplugin
```

## `create-senhub-app plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ create-senhub-app plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ create-senhub-app plugins unlink
  $ create-senhub-app plugins remove
```

## `create-senhub-app plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ create-senhub-app plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ create-senhub-app plugins unlink
  $ create-senhub-app plugins remove
```

## `create-senhub-app plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ create-senhub-app plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ create-senhub-app plugins unlink
  $ create-senhub-app plugins remove
```

## `create-senhub-app plugins update`

Update installed plugins.

```
USAGE
  $ create-senhub-app plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

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
