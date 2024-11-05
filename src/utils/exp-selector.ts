export const expSelector_func = () => {
  const expSelector_el = document.querySelectorAll('[this-is-a-city-page]');

  if (expSelector_el.length) {
    let detectedCity = sessionStorage.getItem('savedCity');

    if (!detectedCity) {
      // Если города нет в LocalStorage, определяем по URL
      const urlPath = window.location.pathname.toLowerCase();
      const cityMatch = urlPath.match(/(?:\/city\/|\/|-)(new-york|los-angeles|chicago|houston)$/i);
      detectedCity = cityMatch ? cityMatch[1].toLowerCase() : null;
    }

    expSelector_el.forEach((bodyElement) => {
      const allDropDowns = bodyElement.querySelectorAll('[exp-variants-dropdown]');

      allDropDowns.forEach((allDropDown_el) => {
        const currentDropdownMenu = allDropDown_el.querySelectorAll(
          '[exp-dropdown-button-list-new]'
        );

        currentDropdownMenu.forEach((currentDropdownMenu_el) => {
          const allSvgInside = currentDropdownMenu_el.querySelectorAll('svg');
          allSvgInside.forEach((svg) => svg.classList.add('hide'));

          const allExpButtons = currentDropdownMenu_el.querySelectorAll('[exp-city-dropdown]');
          allExpButtons.forEach((el_allExpButtons) => {
            const currentListElement = el_allExpButtons.querySelector('[exp-city-dropdown-list]');
            if (currentListElement) {
              currentListElement.classList.add('hide');
            }

            el_allExpButtons.addEventListener(
              'click',
              function () {
                if (detectedCity) {
                  const allIncludedLinks = el_allExpButtons.querySelectorAll('a');
                  allIncludedLinks.forEach((link) => {
                    const currentLinkCity = link.getAttribute('exp-city-dropdown-city-slug');
                    if (currentLinkCity === detectedCity) {
                      window.location.href = link.href;
                    }
                  });
                } else {
                  // Если detectedCity нет, добавляем обработчики на клики по ссылкам
                  el_allExpButtons.querySelectorAll('a').forEach((link) => {
                    link.addEventListener('click', () => {
                      window.location.href = link.href;
                    });
                  });
                }
              },
              { once: true }
            ); // Слушатель срабатывает только один раз
          });
        });
      });
    });
  }
};
