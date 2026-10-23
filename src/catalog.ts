type ProductShape = {
  slug: string;
  name: string;
};

export const products = [
  {
    "slug": "root-1000-g12-5",
    "name": "RS 1000 G12.5"
  },
  {
    "slug": "root-2000-g12-5",
    "name": "RS 2000 G12.5"
  },
  {
    "slug": "root-8000-g12-5",
    "name": "RS 8000 G12.5"
  },
  {
    "slug": "vps-1000-g12-5",
    "name": "VPS 1000 G12.5"
  },
  {
    "slug": "vps-2000-g12-5",
    "name": "VPS 2000 G12.5"
  },
  {
    "slug": "vps-4000-g12-5",
    "name": "VPS 4000 G12.5"
  },
  {
    "slug": "vps-8000-g12-5",
    "name": "VPS 8000 G12.5"
  },
  {
    "slug": "webhosting-2000-nue",
    "name": "Webhosting 2000 NUE"
  },
  {
    "slug": "webhosting-4000-nue",
    "name": "Webhosting 4000 NUE"
  },
  {
    "slug": "webhosting-8000-nue",
    "name": "Webhosting 8000 NUE"
  }
] as const satisfies readonly ProductShape[];

// IDs prevent a code for a retired generation or another location being relabeled.
export const voucherTypeIds: Record<string, number> = {"root-1000-g12-5": 6874, "root-2000-g12-5": 6875, "root-8000-g12-5": 6876, "vps-1000-g12-5": 6877, "vps-2000-g12-5": 6878, "vps-4000-g12-5": 6879, "vps-8000-g12-5": 6880, "webhosting-2000-nue": 5207, "webhosting-4000-nue": 5208, "webhosting-8000-nue": 5209};

export type Product = (typeof products)[number];
export type ProductSlug = Product["slug"];

export const productSlugs = products.map((product) => product.slug) as ProductSlug[];

function normalizeLookup(value: string) {
  return value.toLowerCase().replaceAll(/[^a-z0-9]/g, "");
}

export function findProducts(value: string | undefined): readonly Product[] {
  if (!value) return [];
  const normalized = normalizeLookup(value);
  if (!normalized) return [];
  const exact = products.find((product) => (
    normalizeLookup(product.slug) === normalized || normalizeLookup(product.name) === normalized
  ));
  if (exact) return [exact];

  return products.filter((product) => (
    normalizeLookup(product.slug).includes(normalized) || normalizeLookup(product.name).includes(normalized)
  ));
}

export function resolveProduct(value: string | undefined): Product | null {
  const matches = findProducts(value);
  return matches.length === 1 ? matches[0] : null;
}
