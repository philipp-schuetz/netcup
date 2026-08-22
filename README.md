# netcup voucher CLI

A small, read-only command-line program for querying available netcup product
voucher codes.

The program sends one HTTPS GET request to the configured voucher API,
validates the response, and prints product-to-code pairs. It contains no web
crawler, scraper, account login, data writer, database client, or deployment
tooling.

> This is an independent community project and is not affiliated with netcup.
> Voucher codes are one-time use and can become unavailable at any moment.

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

List every supported product and its currently available codes:

~~~bash
bunx netcup --all
~~~

Filter the response to one product:

~~~bash
bunx netcup vps-1000-g12
bunx netcup "RS 1000 G12"
~~~

Use JSON output:

~~~bash
bunx netcup vps-1000-g12 --json
~~~

Run `bunx netcup --help` for all options. If installed globally, omit `bunx`.

The default source is https://netcupgutschein.com/api/vouchers. A different
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
release and the Bun-based GitHub publishing setup.

## License

[MIT](LICENSE)
