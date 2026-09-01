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
changes, so routine checks do not create no-op commits.

<!-- voucher-codes:start -->
_Last code update: **2026-09-01 16:45 UTC**_

| Product | Available voucher codes |
| :-- | :-- |
| [**RS 1000 G12**](https://www.netcup.com/en/server/root-server/rs-1000-g12-ip-iv-12m)<br><sub>root-1000-g12</sub> | <code>5997nc17882351540</code><br><code>5997nc17882577240</code><br><code>5997nc17882580380</code><br><code>5997nc17882589460</code><br><code>5997nc17882595450</code><br><code>5997nc17882761680</code> |
| [**RS 2000 G12**](https://www.netcup.com/en/server/root-server/rs-2000-g12-ip-iv-12m)<br><sub>root-2000-g12</sub> | <code>5998nc17877656270</code><br><code>5998nc17880943070</code><br><code>5998nc17881191690</code><br><code>5998nc17881195000</code><br><code>5998nc17881888580</code><br><code>5998nc17881965110</code> |
| [**RS 4000 G12**](https://www.netcup.com/en/server/root-server/rs-4000-g12-ip-iv-12m)<br><sub>root-4000-g12</sub> | <code>5999nc17873059050</code><br><code>5999nc17877022110</code><br><code>5999nc17878436280</code><br><code>5999nc17879238480</code><br><code>5999nc17880823680</code><br><code>5999nc17881106470</code> |
| [**RS 8000 G12**](https://www.netcup.com/en/server/root-server/rs-8000-g12-ip-iv-12m)<br><sub>root-8000-g12</sub> | <code>6000nc17872034050</code><br><code>6000nc17873031300</code><br><code>6000nc17879103820</code><br><code>6000nc17880936710</code><br><code>6000nc17880936711</code><br><code>6000nc17881611040</code> |
| [**VPS 1000 G12**](https://www.netcup.com/en/server/vps/vps-1000-g12-iv-12m)<br><sub>vps-1000-g12</sub> | <code>5799nc17880744170</code><br><code>5799nc17880762130</code><br><code>5799nc17881672320</code><br><code>5799nc17881675340</code><br><code>5799nc17882577250</code><br><code>5799nc17882771310</code> |
| [**VPS 2000 G12**](https://www.netcup.com/en/server/vps/vps-2000-g12-iv-12m)<br><sub>vps-2000-g12</sub> | <code>5800nc17855797990</code><br><code>5800nc17872021630</code><br><code>5800nc17874378790</code><br><code>5800nc17877015730</code><br><code>5800nc17878333980</code><br><code>5800nc17880067940</code> |
| [**VPS 4000 G12**](https://www.netcup.com/en/server/vps/vps-4000-g12-iv-12m)<br><sub>vps-4000-g12</sub> | <code>5801nc17823158290</code><br><code>5801nc17863796540</code><br><code>5801nc17880967610</code><br><code>5801nc17881861200</code><br><code>5801nc17882473700</code><br><code>5801nc17882546050</code> |
| [**VPS 8000 G12**](https://www.netcup.com/en/server/vps/vps-8000-g12-iv-12m)<br><sub>vps-8000-g12</sub> | <code>5802nc17823161240</code><br><code>5802nc17823161241</code><br><code>5802nc17871547160</code><br><code>5802nc17874563790</code><br><code>5802nc17881931590</code><br><code>5802nc17882546050</code> |
| [**Webhosting 2000**](https://www.netcup.com/en/hosting/web-hosting/webhosting-2000-vie-iv)<br><sub>webhosting-2000</sub> | <code>1927nc17309775710</code><br><code>1927nc17309775711</code><br><code>1927nc17309775712</code><br><code>1927nc17309775714</code><br><code>4602nc17855643400</code><br><code>4602nc17880593540</code> |
| [**Webhosting 4000**](https://www.netcup.com/en/hosting/web-hosting/webhosting-4000-vie-iv)<br><sub>webhosting-4000</sub> | <code>1928nc17309776320</code><br><code>1928nc17309776321</code><br><code>1928nc17309776325</code><br><code>1928nc17309776326</code><br><code>4603nc17823164450</code><br><code>4603nc17823164451</code> |
| [**Webhosting 8000**](https://www.netcup.com/en/hosting/web-hosting/webhosting-8000-vie-iv)<br><sub>webhosting-8000</sub> | <code>1929nc17309777820</code><br><code>1929nc17309777821</code><br><code>1929nc17309777822</code><br><code>4604nc17823164460</code><br><code>4604nc17823167320</code><br><code>4604nc17823167321</code> |
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
bunx netcup vps-1000-g12
bunx netcup "RS 1000 G12"
~~~

Use JSON output:

~~~bash
bunx netcup vps-1000-g12 --json
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
