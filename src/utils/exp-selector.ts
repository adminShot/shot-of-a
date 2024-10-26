export const expSelector_func = () => {
  const expSelector_el = document.querySelectorAll('[this-is-a-city-page]');

  if (expSelector_el.length) {
    expSelector_el.forEach((bodyElement) => {
      const allDropDowns = document.querySelectorAll('[exp-variants-dropdown]');
      allDropDowns.forEach((allDropDown_el) => {
        const currentDropdownMenu = allDropDown_el.querySelectorAll(
          '[exp-dropdown-button-list-new]'
        );
        currentDropdownMenu.forEach((currentDropdownMenu_el) => {
          const allSvgInside = currentDropdownMenu_el.querySelectorAll('svg');
          allSvgInside.forEach((svg) => {
            svg.classList.add('hide');
          });

          const allExpButtons = currentDropdownMenu_el.querySelectorAll('[exp-city-dropdown]');
          allExpButtons.forEach((el_allExpButtons) => {
            const currentListElement = el_allExpButtons.querySelector('[exp-city-dropdown-list]');
            currentListElement.classList.add('hide');

            el_allExpButtons.addEventListener('click', function () {
              let detectedCity = localStorage.getItem('savedCity');

              // Если savedCity нет в localStorage, используем город из URL
              if (!detectedCity) {
                const urlPath = window.location.pathname;
                const cityMatch = urlPath.match(
                  /-(new-york|los-angeles|chicago|houston|san-francisco)$/i
                );
                detectedCity = cityMatch ? cityMatch[1].toLowerCase() : null;
              }

              // Проверяем, что город определён (либо из savedCity, либо из URL)
              if (detectedCity) {
                const allIncludedLinks = el_allExpButtons.querySelectorAll('a');
                allIncludedLinks.forEach((link) => {
                  const currentLinkCity = link.getAttribute('exp-city-dropdown-city-slug');
                  if (currentLinkCity === detectedCity) {
                    window.location.href = link.href;
                  }
                });
              } else {
                // Если город не удалось определить, просто позволяем ссылкам работать по умолчанию
                el_allExpButtons.querySelectorAll('a').forEach((link) => {
                  link.addEventListener('click', (e) => {
                    window.location.href = link.href;
                  });
                });
              }
            });
          });
        });
      });
    });
  }
};
