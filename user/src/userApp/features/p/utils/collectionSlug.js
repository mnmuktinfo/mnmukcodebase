/**
 * parseCollectionSlug
 * --------------------
 * Recognizes price-based collection slugs, e.g. matching
 *   https://babli.in/collections/below-1000
 *
 * Supported patterns (extend PRICE_PATTERNS for more phrasings):
 *   below-1000 / under-1000 / upto-1000   -> max: 1000
 *   above-2000 / over-2000                -> min: 2000
 *   between-500-1500                      -> min: 500, max: 1500
 *
 * Any slug that doesn't match is treated as a normal category
 * (existing behaviour is untouched).
 *
 * FIX: priceRange is ALWAYS an object ({} when there's no price
 * match), never null. CollectionPage.jsx reads priceRange.min /
 * priceRange.max directly inside a useLayoutEffect dependency array
 * — that destructuring happens on every render regardless of the
 * isPriceCollection guard inside the effect body, so a null here
 * throws "Cannot read properties of null (reading 'min')" on every
 * non-price URL (new-arrivals, all, etc.).
 */

const PRICE_PATTERNS = [
  {
    // between-500-1500
    regex: /^between-(\d+)-(\d+)$/i,
    parse: (m) => ({ min: Number(m[1]), max: Number(m[2]) }),
    label: (m) => `₹${Number(m[1]).toLocaleString("en-IN")} - ₹${Number(
      m[2],
    ).toLocaleString("en-IN")}`,
  },
  {
    // below-1000 / under-1000 / upto-1000
    regex: /^(?:below|under|upto)-(\d+)$/i,
    parse: (m) => ({ min: undefined, max: Number(m[1]) }),
    label: (m) => `Under ₹${Number(m[1]).toLocaleString("en-IN")}`,
  },
  {
    // above-2000 / over-2000
    regex: /^(?:above|over)-(\d+)$/i,
    parse: (m) => ({ min: Number(m[1]), max: undefined }),
    label: (m) => `Above ₹${Number(m[1]).toLocaleString("en-IN")}`,
  },
];

/**
 * @param {string} slug - the raw `collectionType` route param
 * @returns {{ isPriceCollection: boolean, priceRange: {min?: number, max?: number}, label: string | null }}
 */
export const parseCollectionSlug = (slug = "") => {
  const normalized = String(slug).trim().toLowerCase();

  for (const pattern of PRICE_PATTERNS) {
    const match = normalized.match(pattern.regex);
    if (match) {
      return {
        isPriceCollection: true,
        priceRange: pattern.parse(match),
        label: pattern.label(match),
      };
    }
  }

  // FIX: was `priceRange: null` — now always an object so
  // `priceRange.min` / `priceRange.max` never throw.
  return { isPriceCollection: false, priceRange: {}, label: null };
};