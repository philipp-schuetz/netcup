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

## Install

~~~bash
git clone https://github.com/philipp-schuetz/netcup.git
cd netcup
bun install --frozen-lockfile
bun link
~~~

## Usage

List every supported product and its currently available codes:

~~~bash
netcup
~~~

Filter the response to one product:

~~~bash
netcup vps-1000-g12
netcup "RS 1000 G12"
~~~

Use JSON output:

~~~bash
netcup vps-1000-g12 --json
~~~

Run "netcup --help" for all options.

The default source is https://netcupgutschein.com/api/vouchers. A different
HTTPS endpoint with the same public JSON shape can be supplied using
"--source <https-url>" or "NETCUP_VOUCHER_SOURCE".

## Development

~~~bash
bun install
bun run check
~~~

## License

[MIT](LICENSE)
