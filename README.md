# netcup voucher CLI

[![Refresh voucher codes](https://github.com/philipp-schuetz/netcup/actions/workflows/update-readme-vouchers.yml/badge.svg)](https://github.com/philipp-schuetz/netcup/actions/workflows/update-readme-vouchers.yml)

A small, read-only command-line program for querying available netcup product
voucher codes.

Prefer a browser? Browse the current [netcup Gutschein finder and live voucher
catalog](https://netcupgutschein.com/).

The program sends one HTTPS GET request to the configured voucher API,
validates the response, and prints product-to-code pairs. The default data
source keeps each complete response unchanged for one hour. It contains no web
crawler, scraper, account login, data writer, database client, or deployment
tooling.

> This is an independent community project and is not affiliated with netcup.
> Voucher codes are one-time use and can become unavailable at any moment.

## Current voucher codes

This table is refreshed automatically every six hours from the same one-hour
cached data source used by the CLI. Codes are one-time use and may become
unavailable between refreshes. The timestamp changes only when the code list
changes, so routine checks do not create no-op commits. Failed or expired
API responses fail the action instead of being presented as newly verified data.
The action only reads the cached feed; it never logs into CCP or generates codes.
The current catalog keeps G12.5 and NUE identities separate from retired variants.

<!-- voucher-codes:start -->
_Last code update: **2026-10-28 07:37 UTC**_

| Product | Available voucher codes |
| :-- | :-- |
| [**RS 1000 G12.5**](https://www.netcup.com/en/server/root-server/rs-1000-g12.5-iv-24m-eu#rs-1000-g12.5-iv-12m-eu)<br><sub>root-1000-g12-5</sub> | <code>6874nc17927668910</code><br><code>6874nc17927668911</code><br><code>6874nc17927668912</code><br><code>6874nc17927668913</code><br><code>6874nc17929091120</code><br><code>6874nc17930420200</code> |
| [**RS 2000 G12.5**](https://www.netcup.com/en/server/root-server/rs-2000-g12.5-iv-24m-eu#rs-2000-g12.5-iv-12m-eu)<br><sub>root-2000-g12-5</sub> | <code>6875nc17927668910</code><br><code>6875nc17927668911</code><br><code>6875nc17927668912</code><br><code>6875nc17927668913</code><br><code>6875nc17927668914</code><br><code>6875nc17927668915</code> |
| [**RS 8000 G12.5**](https://www.netcup.com/en/server/root-server/rs-8000-g12.5-iv-24m-eu#rs-8000-g12.5-iv-12m-eu)<br><sub>root-8000-g12-5</sub> | <code>6876nc17927671590</code><br><code>6876nc17927725100</code><br><code>6876nc17927725101</code><br><code>6876nc17927725102</code><br><code>6876nc17927725103</code><br><code>6876nc17927725104</code> |
| [**VPS 1000 G12.5**](https://www.netcup.com/en/server/vps/vps-1000-g12.5-iv-24m-eu#vps-1000-g12.5-iv-12m-eu)<br><sub>vps-1000-g12-5</sub> | <code>6877nc17927671590</code><br><code>6877nc17927725101</code><br><code>6877nc17927725102</code><br><code>6877nc17927725103</code><br><code>6877nc17929956050</code><br><code>6877nc17931264360</code> |
| [**VPS 2000 G12.5**](https://www.netcup.com/en/server/vps/vps-2000-g12.5-iv-24m-eu#vps-2000-g12.5-iv-12m-eu)<br><sub>vps-2000-g12-5</sub> | <code>6878nc17927671590</code><br><code>6878nc17927725101</code><br><code>6878nc17927725102</code><br><code>6878nc17930202810</code><br><code>6878nc17930214850</code><br><code>6878nc17930623190</code> |
| [**VPS 4000 G12.5**](https://www.netcup.com/en/server/vps/vps-4000-g12.5-iv-24m-eu#vps-4000-g12.5-iv-12m-eu)<br><sub>vps-4000-g12-5</sub> | <code>6879nc17927671590</code><br><code>6879nc17927725101</code><br><code>6879nc17927725102</code><br><code>6879nc17927725103</code><br><code>6879nc17927725104</code><br><code>6879nc17930202810</code> |
| [**VPS 8000 G12.5**](https://www.netcup.com/en/server/vps/vps-8000-g12.5-iv-24m-eu#vps-8000-g12.5-iv-12m-eu)<br><sub>vps-8000-g12-5</sub> | <code>6880nc17927671600</code><br><code>6880nc17927725101</code><br><code>6880nc17927725102</code><br><code>6880nc17927725103</code><br><code>6880nc17927725104</code><br><code>6880nc17930214850</code> |
| [**Webhosting 2000 NUE**](https://www.netcup.com/en/hosting/web-hosting/webhosting-2000-vie-iv#webhosting-2000-nue-iv)<br><sub>webhosting-2000-nue</sub> | <code>5207nc17927668910</code><br><code>5207nc17927668911</code><br><code>5207nc17927668912</code><br><code>5207nc17927668913</code><br><code>5207nc17927668914</code><br><code>5207nc17927668915</code> |
| [**Webhosting 4000 NUE**](https://www.netcup.com/en/hosting/web-hosting/webhosting-4000-vie-iv#webhosting-4000-nue-iv)<br><sub>webhosting-4000-nue</sub> | <code>5208nc17927668910</code><br><code>5208nc17927668911</code><br><code>5208nc17927668912</code><br><code>5208nc17927668913</code><br><code>5208nc17927668914</code><br><code>5208nc17927668915</code> |
| [**Webhosting 8000 NUE**](https://www.netcup.com/en/hosting/web-hosting/webhosting-8000-vie-iv#webhosting-8000-nue-iv)<br><sub>webhosting-8000-nue</sub> | <code>5209nc17927668910</code><br><code>5209nc17927668911</code><br><code>5209nc17927668912</code><br><code>5209nc17927668913</code><br><code>5209nc17927668914</code><br><code>5209nc17927668915</code> |
| [**Webhosting 2000 NUE 1M**](https://www.netcup.com/de/hosting/webhosting/webhosting-2000-30prozent-rabatt-nue-1m)<br><sub>webhosting-2000-nue-1m</sub> | <code>6920nc17931725440</code><br><code>6920nc17931725441</code><br><code>6920nc17931725442</code> |
<!-- voucher-codes:end -->

## Requirements

- [Bun](https://bun.sh/) 1.2 or newer

The npm package still uses Bun as its runtime.

## Install

~~~bash
bun add --global netcup
~~~

Installing through npm also works when Bun is already installed:

~~~bash
npm install --global netcup
~~~

## Usage

Show help without installing the package globally:

~~~bash
bunx netcup
~~~

List the supported product catalog without querying the voucher API:

~~~bash
bunx netcup list
bunx netcup list --json
~~~

List every supported product and its currently available codes:

~~~bash
bunx netcup --all
~~~

Filter by a full or partial product name. Broad queries return every matching
product, so `root` returns all supported Root Servers:

~~~bash
bunx netcup root
bunx netcup vps-1000-g12-5
bunx netcup "RS 1000 G12.5"
~~~

Use JSON output:

~~~bash
bunx netcup vps-1000-g12-5 --json
~~~

Run `bunx netcup --help` for all options. If installed globally, omit `bunx`.

The default source is https://netcupgutschein.com/api/cli/vouchers. Its complete
voucher snapshot is cached server-side for one hour. A different
HTTPS endpoint with the same public JSON shape can be supplied using
"--source <https-url>" or "NETCUP_VOUCHER_SOURCE".

## Development

~~~bash
git clone https://github.com/philipp-schuetz/netcup.git
cd netcup
bun install
bun run check
bun run release:check
~~~

Maintainers should follow [PUBLISHING.md](PUBLISHING.md) for the initial npm
release and token-free GitHub trusted publishing setup.

## License

[MIT](LICENSE)

The `webhosting-2000-nue-1m` product is the one-month minimum-term,
monthly-billed NUE offer (CCP type 6920), separate from the existing
`webhosting-2000-nue` twelve-month offer (5207). Its official €2.82/month
German VAT-inclusive price already includes the ongoing 30% discount.
The shared inventory keeps three monthly codes and six per existing product;
README refreshes still run every six hours without contacting CCP.
