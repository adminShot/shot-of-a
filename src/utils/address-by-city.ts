/**
 * Applies city/state-specific address data to elements.
 *
 * Usage in markup (anywhere on the page or inside cards):
 * - Set one or more of these attributes with `city@value;city2@value2;` mapping:
 *   - `address-text` — sets element's textContent
 *   - `address-href` — sets `href` attribute (for links/buttons)
 *   - `address-src`  — sets `src` attribute (for iframes, images, etc.)
 *
 * City is resolved as: sessionStorage.savedCity -> URL `/city/<slug>` -> body[this-is-a-city-page].
 */

export function addressByCity_func(): void {
  const slugify = (s: string) => s.trim().toLowerCase().replace(/\s+/g, '-');

  let currentCity: string | null = null;
  try {
    const saved = sessionStorage.getItem('savedCity');
    if (saved) currentCity = slugify(saved);
  } catch {
    /* ignore */
  }
  if (!currentCity) {
    const m = window.location.pathname.match(/(?:\/city\/|\/|-)([a-z0-9\-]+)(?:$|\/)/i);
    if (m) currentCity = slugify(m[1]);
  }
  if (!currentCity) {
    const bodyAttr = document.body.getAttribute('this-is-a-city-page');
    if (bodyAttr) currentCity = slugify(bodyAttr);
  }
  // Если город не определён — показываем все адресные блоки
  if (!currentCity) {
    document.querySelectorAll<HTMLElement>('[address-city]')[0].classList.remove('hide');
    return;
  }

  const parseList = (raw: string | null): string[] =>
    (raw ?? '')
      .split(';')
      .map((s) => slugify(s))
      .filter(Boolean);

  // Show/hide duplicated address blocks: [address-city="new-york;los-angeles"]
  let matched = false;
  const nodes = Array.from(document.querySelectorAll<HTMLElement>('[address-city]'));
  nodes.forEach((el) => {
    const cities = parseList(el.getAttribute('address-city'));
    if (!cities.length) return; // no binding — do nothing
    const show = cities.includes(currentCity!);
    if (show) matched = true;
    el.classList.toggle('hide', !show);
  });

  // Если ни один блок не соответствует — показываем все
  if (!matched) nodes.forEach((el) => el.classList.remove('hide'));
}
