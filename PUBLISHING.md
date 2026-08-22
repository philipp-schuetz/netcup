# Publishing `netcup`

This repository publishes only the read-only voucher CLI. The package uses the
`files` allowlist in `package.json`, so npm receives `src/`, `package.json`,
`README.md`, `LICENSE`, and nothing from the private parent project.

Never add an npm token, OTP, SSH key, API credential, `.env` file, crawler, or
private data-source implementation to this repository. In particular, do not
put `_authToken` in the tracked `.npmrc` file. The GitHub workflow contains
no npm token or other publishing secret.

## First release

Bootstrap `netcup@0.1.0` once from a trusted workstation with Bun 1.4 and npm
account 2FA enabled. Node.js and a system npm installation are not required:

```bash
git clone https://github.com/philipp-schuetz/netcup.git
cd netcup
bun install --frozen-lockfile
bun run check
bun run release:check
bunx --bun npm@latest login --auth-type=web
bun pm whoami
bun run release
bunx --bun npm@latest logout --registry=https://registry.npmjs.org/
```

Read the dry-run file list before publishing. It must contain only:

```text
LICENSE
README.md
package.json
src/bin.ts
src/catalog.ts
src/cli.ts
src/inventory.ts
```

Do not pass an npm token on the command line. Complete the browser login and
2FA challenge interactively, then log out immediately so the bootstrap CLI
credential is revoked. Log out even if publishing fails.

## Configure GitHub

Create a protected GitHub environment for the public repository:

1. Open repository **Settings → Environments → New environment**.
2. Name it exactly `npm`.
3. Add a required reviewer and keep self-review disabled when your repository
   plan and team setup allow it.
4. Do not add an `NPM_TOKEN` secret.

Do not create a repository variable or commit a token-bearing `.npmrc`.

## Configure npm trusted publishing

Open the `netcup` package on npm, then **Settings → Trusted Publisher** and use:

| Field | Value |
| --- | --- |
| Provider | GitHub Actions |
| Organization or user | `philipp-schuetz` |
| Repository | `netcup` |
| Workflow filename | `publish.yml` |
| Environment name | `npm` |
| Allowed actions | `npm publish` |

The workflow uses Bun for installing, testing, typechecking, and inspecting the
package. Its final registry operation uses npm CLI only because npm trusted
publishing performs its OIDC credential exchange there. No long-lived token is
stored. The workflow also requires an exact version and a tagged commit on
`main`.

## Later releases

1. Run `bun pm version patch --no-git-tag-version` (or choose `minor`/`major`),
   update `src/cli.ts` to the same version, run `bun run check`, and merge the
   version commit into `main`.
2. Tag that commit as `v<version>` and push the tag. For example, version
   `0.1.1` uses `git tag v0.1.1` followed by `git push origin v0.1.1`.
3. The **Publish to npm** workflow starts automatically, verifies that
   the tag is on `main`, and checks the tag against `package.json`.
4. Approve the GitHub `npm` environment deployment when protection rules
   require it. Manual `workflow_dispatch` from `main` remains available as a
   fallback.
5. Confirm the package contents on npm before announcing the release.
6. After the first trusted release succeeds, set package publishing access to
   **Require two-factor authentication and disallow tokens** and revoke any old
   automation tokens.
