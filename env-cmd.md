# env-cmd

env-cmd is a small command line tool that loads variables from a `.env` file and then runs your command with them. It works the same on Windows, Mac and Linux.

## Why use it

- **Keep settings out of code**: API URLs and ports live in a `.env` file, not in your JavaScript.
- **Switch environments easily**: use `.env.development` for local work and `.env.production` for builds.
- **Cross-platform**: setting variables like `API_URL=x npm start` does not work in Windows terminals. env-cmd does the same job everywhere.
- **No code changes**: the variables appear in `process.env` before your command starts.

## A small example

Install it as a dev dependency:

```bash
npm install -D env-cmd
```

Create a `.env.staging` file (do not commit real secrets to git):

```bash
API_URL=https://staging.example.com
PORT=4000
```

Use it in `package.json` scripts:

```json
{
  "scripts": {
    "start": "env-cmd -- node server.js",
    "start:staging": "env-cmd -f .env.staging -- node server.js"
  }
}
```

- `env-cmd -- node server.js` loads `./.env` (the default file).
- `-f .env.staging` loads a different file.
- `--` separates env-cmd options from the command you want to run.
- Inside `server.js`, read the values with `process.env.API_URL` and `process.env.PORT`.

## All options

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
