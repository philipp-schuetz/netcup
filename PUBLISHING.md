# Publishing `netcup`

This repository publishes only the read-only voucher CLI. The package uses the
`files` allowlist in `package.json`, so npm receives `src/`, `package.json`,
`README.md`, `LICENSE`, and nothing from the private parent project.

Never add an npm token, OTP, SSH key, API credential, `.env` file, crawler, or
private data-source implementation to this repository. In particular, do not
put `_authToken` in the tracked `.npmrc` file or in GitHub Actions secrets.

## First release

Trusted publishing is configured on an existing npm package. Bootstrap
`netcup@0.1.0` once from a trusted workstation with npm account 2FA enabled:

```bash
git clone https://github.com/philipp-schuetz/netcup.git
cd netcup
bun install --frozen-lockfile
bun run check
npm login --auth-type=web
npm whoami
npm pack --dry-run
npm publish --access public
npm logout --registry=https://registry.npmjs.org/
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
credential is revoked. Log out even if publishing fails. Delete any generated
`netcup-*.tgz` archive after inspection; archives are ignored by Git.

## Configure GitHub

After the first release, create a GitHub environment named `npm`:

1. Open repository **Settings → Environments → New environment**.
2. Name it exactly `npm`.
3. Add a required reviewer and keep self-review disabled when your repository
   plan and team setup allow it.
4. Do not add an `NPM_TOKEN` secret.

## Configure npm trusted publishing

Open the `netcup` package on npm, then **Settings → Trusted Publisher** and use:

| Field | Value |
| --- | --- |
| Provider | GitHub Actions |
| Organization or user | `philipp-schuetz` |
| Repository | `netcup` |
| Workflow filename | `publish.yml` |
| Environment name | `npm` |
| Allowed actions | `npm stage publish` only |

The workflow filename is case-sensitive. Enter only `publish.yml`, not
`.github/workflows/publish.yml`.

## Later releases

1. Change `version` in `package.json` to a version that has never been
   published, update the lockfile if Bun changes it, run `bun run check`, and
   merge the commit into `main`.
2. Open **Actions → Publish to npm → Run workflow** on `main`.
3. Approve the GitHub `npm` environment deployment.
4. Review the staged package on npm and approve it with 2FA.
5. Confirm the package contents and provenance on npm before announcing the
   release.

After one OIDC staged release succeeds, open **Settings → Publishing access**
for the package and select **Require two-factor authentication and disallow
tokens**. Revoke any old npm automation token; the workflow does not need one.
