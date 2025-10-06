/**
 * Filters experience cards by selected state/city and keeps page links coherent.
 *
 * How it works (conventions):
 * - Put `experience-card` attribute on every card wrapper element.
 * - On each card, add `available-states="ny;los-angeles;houston"` (slugs, `;`-separated).
 * - Current state is resolved in this order:
 *   1) <body this-is-a-city-page="…"> (preferred on CMS pages)
 *   2) sessionStorage.savedCity
 *   3) "…/city/<slug>…" in URL
 *   4) first state seen among cards
 * - Cards without a matching state get a `hide` class.
 * - Booking/payment links inside the cards can be handled by existing
 *   `[book-now-button]` + `price-info` attributes via bookLinks_func.
 */

export function experienceStateFilter_func(): void {
  // Support both explicit [experience-card] and existing collection markup [exp-collection-item]
  const cards = document.querySelectorAll<HTMLElement>('[experience-card], [exp-collection-item]');
  if (!cards.length) return;

  const slugify = (s: string) => s.trim().toLowerCase().replace(/\s+/g, '-');
  const parseList = (raw: string | null): string[] =>
    (raw ?? '')
      .split(';')
      .map((s) => slugify(s))
      .filter(Boolean);

  // Prefer sessionStorage (CMS pages often lack stable attributes)
  let currentState: string | null = null;
  try {
    const saved = sessionStorage.getItem('savedCity');
    if (saved) currentState = slugify(saved);
  } catch {
    /* ignore */
  }

  // Then URL
  if (!currentState) {
    const m = window.location.pathname.match(/(?:\/city\/|\/|-)([a-z0-9\-]+)(?:$|\/)/i);
    if (m) currentState = slugify(m[1]);
  }

  // Finally body attr if author placed it
  if (!currentState) {
    const bodyState = document.body.getAttribute('this-is-a-city-page');
    if (bodyState) currentState = slugify(bodyState);
  }

  if (!currentState) {
    // fallback: collect first available from cards
    for (const card of Array.from(cards)) {
      const list =
        parseList(card.getAttribute('available-states')) ||
        parseList(card.getAttribute('available-cities')) ||
        parseList(card.getAttribute('data-available'));
      if (list.length) {
        currentState = list[0];
        break;
      }
    }
  }

  if (!currentState) return;

  // Helper: parse "city@value;city2@value2" → [city, city2]
  const parseKeyed = (raw: string | null): string[] =>
    (raw ?? '')
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((pair) => slugify(pair.split('@')[0] ?? ''))
      .filter(Boolean);

  cards.forEach((card) => {
    const explicit =
      parseList(card.getAttribute('available-states')) ||
      parseList(card.getAttribute('available-cities')) ||
      parseList(card.getAttribute('data-available'));

    // Derive from card params used in catalog: value-price/value-count/value-age
    const derived = new Set<string>([
      ...parseKeyed(card.getAttribute('value-price')),
      ...parseKeyed(card.getAttribute('value-count')),
      ...parseKeyed(card.getAttribute('value-age')),
    ]);

    const available = explicit.length ? explicit : Array.from(derived);

    // If no availability info is provided — keep visible
    if (!available.length) return;

    const isVisible = available.includes(currentState!);
    card.classList.toggle('hide', !isVisible);
  });
}
