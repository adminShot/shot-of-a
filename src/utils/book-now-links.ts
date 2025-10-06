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

  if (bookLinks_el.length) {
    bookLinks_el.forEach((elButton) => {
      const linkFromAtribute = elButton.getAttribute('book-now-button');
      const priceFromAttribute = elButton.getAttribute('price-info');

      // Обработка ссылок
      if (linkFromAtribute) {
        const atribute_linksItemsList_readyFalse = linkFromAtribute
          .split(';')
          .filter((item) => item.trim() !== '');
        console.log('Список необработанных ссылок:', atribute_linksItemsList_readyFalse);

        atribute_linksItemsList_readyFalse.forEach((el) => {
          console.log('Обработка элемента ссылки:', el);

          const part_first = slugify(el.split('@')[0]);
          const part_second = el.split('@')[1];
          console.log('Часть первая (город):', part_first);
          console.log('Часть вторая (ссылка):', part_second);

          if (currentCity && part_first === currentCity) {
            elButton.setAttribute('href', part_second);
            elButton.classList.remove('hide');
            console.log('Установлен href:', part_second, 'для кнопки:', elButton);
          }
        });
      } else {
        console.warn('Атрибут book-now-button отсутствует у кнопки:', elButton);
      }

      // Обработка цен
      if (priceFromAttribute) {
        const priceItemsList_readyFalse = priceFromAttribute
          .split(';')
          .filter((item) => item.trim() !== '');
        console.log('Список необработанных цен:', priceItemsList_readyFalse);

        priceItemsList_readyFalse.forEach((priceEl) => {
          const price_city = slugify(priceEl.split('@')[0]);
          const price_value = priceEl.split('@')[1];
          console.log('Часть первая (город):', price_city);
          console.log('Часть вторая (цена):', price_value);

          if (currentCity && price_city === currentCity) {
            elButton.setAttribute('data-price', price_value); // Устанавливаем data-атрибут для цены

            // Ищем родительский элемент с data-price-text и обновляем его текст
            const parentWithPriceText = (elButton
              .closest('.exp-slider_title-wrapper')
              ?.querySelector('[data-price-text]') as HTMLElement | null);
            if (parentWithPriceText) {
              parentWithPriceText.setAttribute('data-price-text', price_value); // Устанавливаем значение атрибута
              parentWithPriceText.textContent = price_value; // Обновляем текст внутри
              console.log(
                'Установлена цена:',
                price_value,
                'в родительском блоке:',
                parentWithPriceText
              );
            } else {
              console.log('Родительский элемент с data-price-text не найден');
            }
          }
        });
      } else {
        console.warn('Атрибут price-info отсутствует у кнопки:', elButton);
      }
    });
  }
};
