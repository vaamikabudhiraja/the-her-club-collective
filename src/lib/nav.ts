// Navigation structure. Edit these lists to add/remove browse links — the
// pages they point at pull their products live from Shopify, so nothing here
// hard-codes products. Remove any type you won't stock once your range is set.

export type NavLink = { label: string; href: string };

// Browse by jewellery type — driven by Shopify product type.
export const TYPE_LINKS: NavLink[] = [
  { label: "Necklaces", href: "/type/necklaces" },
  { label: "Earrings", href: "/type/earrings" },
  { label: "Bracelets", href: "/type/bracelets" },
  { label: "Rings", href: "/type/rings" },
  { label: "Charms", href: "/type/charms" },
];

// Browse by collection — driven by Shopify collections.
export const COLLECTION_LINKS: NavLink[] = [
  { label: "Everyday", href: "/collections/everyday" },
  { label: "Occasion", href: "/collections/occasion" },
  { label: "Streetstyle", href: "/collections/streetstyle" },
];
