# Building in CI

CI runs your install, lint, test and build steps automatically on a clean server every time you push, so broken code is caught before it ships.

## What it is

**CI** stands for **Continuous Integration**. It means: every time someone pushes code, a robot server checks it automatically.

The server starts from a fresh, empty machine. It downloads your code and runs the same commands you run on your laptop:

1. install packages
2. lint (check code style and common mistakes)
3. test
4. build

If any step fails, CI marks the commit with a red cross. If all pass, you get a green tick.

Analogy: CI is like a quality check at the end of a factory line. Every product is checked the same way before it leaves.

## Why we use it

- **"Works on my machine" problems are caught.** The CI server has none of your local files, so missing packages or files show up quickly.
- **Nobody forgets to run the tests.** It happens on every push and pull request.
- **The build output is created the same way every time**, which makes deploys safe and repeatable.

## How it works

1. You push code or open a pull request.
2. The CI service (GitHub Actions, GitLab CI, CircleCI...) starts a fresh machine called a **runner**.
3. It checks out (downloads) your code and installs the right Node.js version.
4. It runs `npm ci` to install packages.
5. It runs lint, tests, then the build.
6. It saves the build output (the `dist/` folder) as an **artifact** so it can be downloaded or deployed.
7. It reports pass/fail on the commit or pull request.

## `npm ci` vs `npm install`

Always use `npm ci` in CI.

| | `npm install` | `npm ci` |
| --- | --- | --- |
| Reads | `package.json` | `package-lock.json` (exact versions) |
| Can change the lock file | Yes | No, it fails if the lock file and `package.json` do not match |
| Deletes `node_modules` first | No | Yes, always a clean install |
| Speed in CI | Slower | Faster |

`npm ci` gives you the **exact** same versions every time. That is called a **reproducible** build. Other package managers have the same idea: `pnpm install --frozen-lockfile` and `yarn install --immutable`. See [npm](../02-package-managers/npm.md).

## A small example

Typical `package.json` scripts that CI will call:

```json
{
  "scripts": {
    "dev": "vite",
    "lint": "eslint .",
    "test": "vitest run",
    "build": "vite build"
  }
}
```

The commands CI runs, in order:

```bash
npm ci
npm run lint
npm test
npm run build
```

Note: use `vitest run` (not plain `vitest`) in CI. Plain `vitest` starts **watch mode** and waits forever for file changes.

## Caching

Downloading every package on every run is slow. **Caching** saves the npm download folder between runs, so the next run reuses it.

- The cache **key** is usually based on a hash of `package-lock.json`.
- When the lock file changes, the key changes, and a fresh cache is built.
- With GitHub Actions, `actions/setup-node` can do this for you with `cache: npm`.

## Environment variables

**Environment variables** (env vars) are settings passed to your build from outside the code, like an API URL.

- Put normal settings in the CI config as plain env vars.
- Put **secrets** (API keys, tokens) in the CI service's secret store, never in the code or the YAML file.
- Remember: in a frontend build, any variable your code reads (like `VITE_API_URL`) ends up **inside the JavaScript files** that users download. Never put a real secret there.
- Set `CI=true` (most CI services do this automatically). Many tools read it and change behaviour, for example turning off watch mode or interactive prompts.

## Artifacts

An **artifact** is a file or folder saved from a CI run, like your `dist/` folder or a test report. Later jobs (like "deploy") or people can download it. Artifacts are kept for a limited number of days.

## Failing fast

**Fail fast** means: stop as soon as something is wrong, and do the quick checks first.

- Put fast steps first: lint (seconds), then tests, then the slow build.
- Any command that exits with a non-zero code stops the job.
- Do not hide errors (for example, do not add `|| true` after a command).
- Treat warnings as errors when you want strict checks: `eslint . --max-warnings=0`.

## When to use it

- On every pull request, before merging.
- On every push to `main`, before deploying.
- For any project with more than one developer, and honestly for solo projects too.

## Related notes

- [GitHub Actions](./github-actions.md) - a full workflow file that does all of this
- [ESLint](../07-linters-formatters/eslint.md)
- [npm scripts](../05-task-runners/npm-scripts.md)

## Key points

- CI = a robot that installs, lints, tests and builds on every push.
- Use `npm ci`, not `npm install`, and commit your lock file.
- Cache dependencies using the lock file as the key.
- Keep secrets in the CI secret store; frontend env vars are public.
- Save `dist/` as an artifact.
- Fail fast: cheap checks first, no hidden errors.
