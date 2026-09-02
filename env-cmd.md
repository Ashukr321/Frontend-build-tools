
```
Usage: env-cmd [options] -- <command> [...args]

Options:
  -v, --version                 output the version number
  -e, --environments [envs...]  The rc file environment(s) to use
  -f, --file [path]             Custom env file path or .rc file path if '-e' used (default path: ./.env or ./.env-cmdrc.(js|cjs|mjs|json))
  -x, --expand-envs             Replace $var and ${var} in args and command with environment variables
  --recursive                   Replace $var and ${var} in env file with the referenced environment variable
  --fallback                    Fallback to default env file path, if custom env file path not found
  --no-override                 Do not override existing environment variables
  --silent                      Ignore any env-cmd errors and only fail on executed program failure.
  --use-shell                   Execute the command in a new shell with the given environment
  --verbose                     Print helpful debugging information
  -h, --help                    display help for command
```
