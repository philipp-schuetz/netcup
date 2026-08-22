# Publishing `netcup`

This repository publishes only the read-only voucher CLI. The package uses the
`files` allowlist in `package.json`, so npm receives `src/`, `package.json`,
`README.md`, `LICENSE`, and nothing from the private parent project.

Never add an npm token, OTP, SSH key, API credential, `.env` file, crawler, or
private data-source implementation to this repository. In particular, do not
put `_authToken` in the tracked `.npmrc` file. The GitHub workflow contains
only a reference to an encrypted environment secret, never the secret value.

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

## Create the automation token

`bun publish` accepts `NPM_CONFIG_TOKEN` for non-interactive publishing. After
the first release exists, open npm **Account → Access Tokens → Generate New
Token** and use:

| Field | Value |
| --- | --- |
| Token name | `github-netcup-bun-publish` |
| Bypass two-factor authentication | Enabled |
| Packages and scopes permission | Read and write |
| Package selection | Only `netcup` |
| Organizations permission | No access |
| Expiration | The shortest practical period |

Copy the token once, add it to GitHub immediately, then clear it from the
clipboard. Never paste it into a repository file, issue, command line, or chat.

## Configure GitHub

Create a protected GitHub environment for the public repository:

1. Open repository **Settings → Environments → New environment**.
2. Name it exactly `npm`.
3. Add a required reviewer and keep self-review disabled when your repository
   plan and team setup allow it.
4. Under **Environment secrets**, create `NPM_TOKEN` and paste the granular npm
   token as its value.

Do not create a repository variable or commit a token-bearing `.npmrc`. The
workflow exposes the secret only to the final `bun publish` step. Tests and the
package dry run happen first without the token; lifecycle scripts are disabled
only in that final CI step because the checks have already passed. The workflow
also requires `main`, an exact version confirmation, and environment approval.

## Later releases

1. Run `bun pm version patch --no-git-tag-version` (or choose `minor`/`major`),
   update `src/cli.ts` to the same version, run `bun run check`, and merge the
   version commit into `main`.
2. Tag that commit as `v<version>` and push the tag. For example, version
   `0.1.1` uses `git tag v0.1.1` followed by `git push origin v0.1.1`.
3. The **Publish to npm with Bun** workflow starts automatically, verifies that
   the tag is on `main`, and checks the tag against `package.json`.
4. Approve the GitHub `npm` environment deployment when protection rules
   require it. Manual `workflow_dispatch` from `main` remains available as a
   fallback.
5. Confirm the package contents on npm before announcing the release.
6. Rotate the granular token before it expires and revoke it when automated
   publishing is no longer needed.

Keep npm package publishing access on **Require two-factor authentication or a
granular access token with bypass 2FA enabled**. Selecting **disallow tokens**
will intentionally prevent this Bun workflow from publishing.
