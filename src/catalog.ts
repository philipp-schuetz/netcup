type ProductShape = {
  slug: string;
  name: string;
};

export const products = [
  { slug: "root-1000-g12", name: "RS 1000 G12" },
  { slug: "root-2000-g12", name: "RS 2000 G12" },
  { slug: "root-4000-g12", name: "RS 4000 G12" },
  { slug: "root-8000-g12", name: "RS 8000 G12" },
  { slug: "vps-1000-g12", name: "VPS 1000 G12" },
  { slug: "vps-2000-g12", name: "VPS 2000 G12" },
  { slug: "vps-4000-g12", name: "VPS 4000 G12" },
  { slug: "vps-8000-g12", name: "VPS 8000 G12" },
  { slug: "webhosting-2000", name: "Webhosting 2000" },
  { slug: "webhosting-4000", name: "Webhosting 4000" },
  { slug: "webhosting-8000", name: "Webhosting 8000" },
] as const satisfies readonly ProductShape[];

export type Product = (typeof products)[number];
export type ProductSlug = Product["slug"];

export const productSlugs = products.map((product) => product.slug) as ProductSlug[];

function normalizeLookup(value: string) {
  return value.toLowerCase().replaceAll(/[^a-z0-9]/g, "");
}

export function resolveProduct(value: string | undefined): Product | null {
  if (!value) return null;
  const normalized = normalizeLookup(value);
  const exact = products.find((product) => (
    normalizeLookup(product.slug) === normalized || normalizeLookup(product.name) === normalized
  ));
  if (exact) return exact;

  const matches = products.filter((product) => (
    normalizeLookup(product.slug).includes(normalized) || normalizeLookup(product.name).includes(normalized)
  ));
  return matches.length === 1 ? matches[0] : null;
}
