# GitHub Actions

GitHub Actions is GitHub's built-in CI service: a YAML file in your repo tells GitHub which commands to run on every push or pull request.

## What it is

**GitHub Actions** lets you run scripts on GitHub's servers when something happens in your repository, like a push or a new pull request.

You describe what to do in a **workflow** file. It is written in **YAML** (a simple text format that uses indentation, like Python). Workflow files live in:

```text
.github/workflows/<any-name>.yml
```

This repo already has one: `.github/workflows/codeql.yml`, which runs a security scan.

## Main words to know

| Word | Meaning |
| --- | --- |
| **Workflow** | One YAML file. A full automated process. |
| **Event** (`on:`) | What starts the workflow: `push`, `pull_request`, a schedule... |
| **Job** | A group of steps that runs on one machine. Jobs run in parallel by default. |
| **Runner** (`runs-on:`) | The machine that runs a job, e.g. `ubuntu-latest`. |
| **Step** | One command (`run:`) or one ready-made action (`uses:`). |
| **Action** | A reusable building block, e.g. `actions/checkout@v4`. |

## Why we use it

- It is built into GitHub, so there is nothing extra to sign up for.
- Free minutes for public repos (and a monthly free amount for private repos).
- Thousands of ready-made actions in the GitHub Marketplace.
- Results show directly on commits and pull requests.

## How it works

1. You add a `.yml` file in `.github/workflows/` and push it.
2. GitHub reads the `on:` section to know when to run it.
3. When the event happens, GitHub starts a fresh runner for each job.
4. Each step runs in order. If a step fails, the job stops and is marked red.
5. You see the logs in the **Actions** tab of your repo.

## A complete example

This workflow builds a frontend app (Vite, React, or similar) on every push and pull request to `main`.

```yaml
# .github/workflows/build.yml
name: Build frontend

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

permissions:
  contents: read

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      # 1. Download the repository code onto the runner
      - name: Check out code
        uses: actions/checkout@v4

      # 2. Install Node.js and cache the npm download folder
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      # 3. Clean install using package-lock.json
      - name: Install dependencies
        run: npm ci

      # 4. Fast checks first (fail fast)
      - name: Lint
        run: npm run lint

      - name: Test
        run: npm test --if-present

      # 5. Production build
      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{ vars.API_URL }}

      # 6. Save the dist/ folder so it can be downloaded or deployed
      - name: Upload build output
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist
          retention-days: 7
```

Line by line, the important bits:

- `on:` runs it on pushes and pull requests to `main`.
- `permissions: contents: read` gives the workflow only read access. This is a good, safe default.
- `cache: npm` caches downloads using `package-lock.json` as the key.
- `--if-present` means "skip if there is no `test` script", so the example works even without tests.
- `${{ vars.API_URL }}` reads a **variable** you set in GitHub: Settings > Secrets and variables > Actions. For private values use `${{ secrets.NAME }}`.

## Testing on more than one Node version

A **matrix** runs the same job several times with different values.

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [20, 22, 24]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: npm
      - run: npm ci
      - run: npm run build
```

## Useful extras

- `workflow_dispatch:` under `on:` adds a "Run workflow" button so you can start it by hand.
- `concurrency:` cancels older runs on the same branch when you push again:

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

- `needs: build` makes one job wait for another, e.g. a `deploy` job that runs only after `build` passes.

## When to use it

- Your code is on GitHub and you want automatic checks on every pull request.
- You want to deploy automatically after `main` builds successfully.
- You want scheduled tasks, like the weekly CodeQL scan in this repo.

## Related notes

- [Building in CI](./build-in-ci.md) - the ideas behind each step
- [npm](../02-package-managers/npm.md)

## Key points

- Workflows are YAML files in `.github/workflows/`.
- `on:` = when, `jobs:` = what, `runs-on:` = which machine, `steps:` = the commands.
- Standard steps: `actions/checkout@v4`, `actions/setup-node@v4`, `npm ci`, lint, test, build.
- Use `cache: npm` to speed up installs.
- Keep secrets in GitHub Secrets, never in the YAML.
- Use `actions/upload-artifact@v4` to keep the `dist/` folder.
