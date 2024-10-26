export const expSelector_func = () => {
  const expSelector_el = document.querySelectorAll('[this-is-a-city-page]');

  console.log('expSelector_func: Found [this-is-a-city-page] elements:', expSelector_el.length);

  if (expSelector_el.length) {
    expSelector_el.forEach((bodyElement, index) => {
      const allDropDowns = document.querySelectorAll('[exp-variants-dropdown]');
      console.log(`expSelector_func: Processing dropdowns for element ${index}`);

      allDropDowns.forEach((allDropDown_el, dropIndex) => {
        const currentDropdownMenu = allDropDown_el.querySelectorAll(
          '[exp-dropdown-button-list-new]'
        );
        console.log(
          `Dropdown ${dropIndex}: Found [exp-dropdown-button-list-new] elements:`,
          currentDropdownMenu.length
        );

        currentDropdownMenu.forEach((currentDropdownMenu_el, menuIndex) => {
          const allSvgInside = currentDropdownMenu_el.querySelectorAll('svg');
          console.log(`Menu ${menuIndex}: Hiding SVG elements, count:`, allSvgInside.length);
          allSvgInside.forEach((svg) => svg.classList.add('hide'));

          const allExpButtons = currentDropdownMenu_el.querySelectorAll('[exp-city-dropdown]');
          console.log(
            `Menu ${menuIndex}: Found [exp-city-dropdown] buttons:`,
            allExpButtons.length
          );

          allExpButtons.forEach((el_allExpButtons, buttonIndex) => {
            const currentListElement = el_allExpButtons.querySelector('[exp-city-dropdown-list]');
            currentListElement.classList.add('hide');

            el_allExpButtons.addEventListener('click', function () {
              let detectedCity = localStorage.getItem('savedCity');
              console.log(`Button ${buttonIndex}: Detected city from localStorage:`, detectedCity);

              if (!detectedCity) {
                const urlPath = window.location.pathname;
                const cityMatch = urlPath.match(
                  /-(new-york|los-angeles|chicago|houston|san-francisco)$/i
                );
                detectedCity = cityMatch ? cityMatch[1].toLowerCase() : null;
                console.log(
                  `Button ${buttonIndex}: No savedCity found, fallback to URL-detected city:`,
                  detectedCity
                );
              }

              if (detectedCity) {
                const allIncludedLinks = el_allExpButtons.querySelectorAll('a');
                console.log(
                  `Button ${buttonIndex}: Found links within [exp-city-dropdown]:`,
                  allIncludedLinks.length
                );

                allIncludedLinks.forEach((link, linkIndex) => {
                  const currentLinkCity = link.getAttribute('exp-city-dropdown-city-slug');
                  console.log(`Link ${linkIndex}: Link city slug:`, currentLinkCity);

                  if (currentLinkCity === detectedCity) {
                    console.log(`Link ${linkIndex}: Redirecting to:`, link.href);
                    window.location.href = link.href;
                  }
                });
              } else {
                console.warn(
                  `Button ${buttonIndex}: City not detected in localStorage or URL. Links will be used as-is.`
                );
                el_allExpButtons.querySelectorAll('a').forEach((link, linkIndex) => {
                  link.addEventListener('click', (e) => {
                    console.log(`Link ${linkIndex}: Default redirection to:`, link.href);
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
