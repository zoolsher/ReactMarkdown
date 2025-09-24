# Repository Guidelines

## Project Structure & Module Organization
Source lives in `src/`. `index.ts` orchestrates the MDX transformer API; `loader.ts` exposes the Rspack loader entrypoint. Build artifacts land in `dist/` and are committed only from CI. Configuration lives in `package.json`, `tsconfig.json`, and `rslib.config.ts`.

## Build, Test, and Development Commands
Run `pnpm build` to produce the published bundle via `rslib`. `pnpm dev` starts the watch build for iterative development. `pnpm test` executes `rstest` suites. `pnpm fmt` applies `biome` formatting. Ensure dependencies are installed with `pnpm install` before running any task.

## Coding Style & Naming Conventions
TypeScript files use Biome defaults: 2-space indentation, single quotes, and trailing commas where safe. Prefer descriptive camelCase for functions and variables; keep filenames lowercase with hyphen separation only for multiword helpers. Exported types should use PascalCase. Avoid default exports unless bridging to CJS compatibility.

## Testing Guidelines
Place unit tests alongside code as `*.test.ts` so `rstest` discovers them. Mock external APIs sparingly; prefer running real Markdown samples under `fixtures/` when necessary. Target meaningful coverage of transformer branches—every new syntax case needs at least one assertion. Run `pnpm test -- --watch` locally when iterating; CI requires a clean `pnpm test`.

## Commit & Pull Request Guidelines
Follow Conventional Commits (`feat:`, `fix:`, `chore:`) as seen in history, and keep scopes short (`feat: import pipeline`). Squash noisy work-in-progress commits before pushing. Pull requests must include a concise summary, links to related issues, testing notes (`pnpm test`, manual checks), and before/after snippets when behavior changes. Request review from owners of touched modules and wait for green checks before merge.
