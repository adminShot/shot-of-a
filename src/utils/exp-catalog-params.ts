/**
 * Проставляет бейджи (best, age, price, count) на карточках
 * исходя из города страницы. Никаких внешних массивов городов —
 * всё читается из data-атрибутов самой карточки.
 *
 * markup карточки (пример):
 * <div exp-collection-item
 *      value-best="Moscow;SPB;"
 *      value-age="Moscow@18;SPB@16;"
 *      value-price="Moscow@5000;SPB@4500;"
 *      value-count="Moscow@4;SPB@6;">
 * ...
 * </div>
 */

export function initExpParams(): void {
  const root = document.querySelector<HTMLElement>('[catalog-page-city]');
  if (!root) return;

  const pageCity = root.getAttribute('catalog-page-city')?.trim();
  if (!pageCity) return;

  const cards = document.querySelectorAll<HTMLElement>('[exp-collection-item]');

  /**
   * Универсальный разбор ";"-списка:
   * '' -> [] ; 'Moscow;;SPB' -> ['Moscow','SPB']
   */
  const parseList = (raw: string | null): string[] =>
    (raw ?? '')
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean);

  cards.forEach((card) => {
    /* ------------ BEST ------------ */
    (() => {
      const set = new Set(parseList(card.getAttribute('value-best')));
      if (set.has(pageCity)) {
        card
          .querySelector<HTMLElement>('[exp-columns_slider-header-meta-item="best"]')
          ?.classList.remove('hide');
      }
    })();

    /* ------------ AGE ICON ---------- */
    (() => {
      const pair = parseList(card.getAttribute('value-age'))
        .map((p) => p.split('@'))
        .find(([city]) => city === pageCity);

      if (!pair) return;

      const [, ageCode] = pair;
      const preset = document.querySelector<HTMLElement>(`[icon-age="${ageCode}"]`);
      const container = card.querySelector<HTMLElement>(
        '[exp-columns_slider-header-meta-item="age"]'
      );

      if (preset && container) {
        container.appendChild(preset.cloneNode(true));
        container.classList.remove('hide');
      }
    })();

    /* ------------ PRICE / COUNT (один шаблон) ---------- */
    const applyTextParam = (attr: 'value-price' | 'value-count', slug: 'price' | 'count') => {
      const pair = parseList(card.getAttribute(attr))
        .map((p) => p.split('@'))
        .find(([city]) => city === pageCity);

      if (!pair) return;

      const [, value] = pair;

      const container = card.querySelector<HTMLElement>(
        `[exp-columns_slider-header-meta-item="${slug}"]`
      );
      const valueEl = container?.querySelector<HTMLElement>(
        `[exp-columns_slider-header-meta-item="${slug}-text-value"]`
      );

      if (container && valueEl) {
        valueEl.textContent = value;
        container.classList.remove('hide');
      }
    };

    applyTextParam('value-price', 'price');
    applyTextParam('value-count', 'count');
  });
}
