// Formats a Shopify money value (e.g. "10.0" + "EUR") as a localized price
// like "€10.00". Falls back to a plain string if the currency is unknown.
// Safe to use in both server and client components.
export function formatMoney(amount: string, currencyCode: string): string {
  const value = Number(amount);

  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: currencyCode,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currencyCode}`;
  }
}
