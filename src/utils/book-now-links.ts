export const bookLinks_func = () => {
  const bookLinks_el = document.querySelectorAll('[book-now-button]');
  console.log('Найдено кнопок:', bookLinks_el.length);

  // Detect current city/state more robustly for CMS pages
  const slugify = (s: string) => s.trim().toLowerCase().replace(/\s+/g, '-');
  let currentCity: string | null = null;
  // 1) sessionStorage
  try {
    const saved = sessionStorage.getItem('savedCity');
    if (saved) currentCity = slugify(saved);
  } catch {
    /* ignore */
  }
  // 2) URL
  if (!currentCity) {
    const m = window.location.pathname.match(/(?:\/city\/|\/|-)([a-z0-9\-]+)(?:$|\/)/i);
    if (m) currentCity = slugify(m[1]);
  }
  // 3) body attr — на CMS может отсутствовать
  if (!currentCity) {
    const attr = document.body.getAttribute('this-is-a-city-page');
    if (attr) currentCity = slugify(attr);
  }
  console.log('Текущий город:', currentCity ?? '(не найден)');

  // helpers to parse pairs: "city@value"
  const parsePairs = (raw: string | null): Array<{ city: string; value: string }> => {
    return (raw ?? '')
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((pair) => {
        const city = slugify(pair.split('@')[0] ?? '');
        const value = (pair.split('@')[1] ?? '').trim();
        return { city, value };
      })
      .filter((p) => p.city && p.value);
  };

  const pickForCity = (
    pairs: Array<{ city: string; value: string }>,
    city: string | null
  ): { city: string; value: string } | null => {
    if (!pairs.length) return null;
    if (city) {
      const exact = pairs.find((p) => p.city === city);
      if (exact) return exact;
    }
    // fallback: возьмём первый доступный
    return pairs[0];
  };

  if (bookLinks_el.length) {
    bookLinks_el.forEach((elButton) => {
      const linkFromAtribute = elButton.getAttribute('book-now-button');
      const priceFromAttribute = elButton.getAttribute('price-info');

      // Ссылки: city@href;city2@href2
      const linkPairs = parsePairs(linkFromAtribute);
      const chosenLink = pickForCity(linkPairs, currentCity);
      if (chosenLink) {
        elButton.setAttribute('href', chosenLink.value);
        elButton.classList.remove('hide');
        console.log('Установлен href:', chosenLink.value, 'для кнопки:', elButton);
      } else if (linkFromAtribute) {
        console.warn('Не удалось распарсить book-now-button для кнопки:', elButton);
      }

      // Цена: city@price;city2@price2
      const pricePairs = parsePairs(priceFromAttribute);
      const chosenPrice = pickForCity(pricePairs, currentCity);
      if (chosenPrice) {
        elButton.setAttribute('data-price', chosenPrice.value);
        const parentWithPriceText = elButton
          .closest('.exp-slider_title-wrapper')
          ?.querySelector('[data-price-text]') as HTMLElement | null;
        if (parentWithPriceText) {
          parentWithPriceText.setAttribute('data-price-text', chosenPrice.value);
          parentWithPriceText.textContent = chosenPrice.value;
          console.log('Установлена цена:', chosenPrice.value, 'в блоке:', parentWithPriceText);
        }
      } else if (priceFromAttribute) {
        console.warn('Не удалось распарсить price-info для кнопки:', elButton);
      }
    });
  }
};
