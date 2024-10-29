export const cityDetector_func = () => {
  const defaultCity = 'New York';
  const savedCity = localStorage.getItem('savedCity');

  // Получаем город из URL
  function getCityFromCurrentUrl() {
    const urlPath = window.location.pathname;
    const cityMatch = urlPath.match(/-(new-york|los-angeles|chicago|houston)$/i);
    return cityMatch ? cityMatch[1].toLowerCase() : null;
  }

  function updateLinksForCurrentCity(city) {
    const linksToUpdate = document.querySelectorAll('[exp-city-dropdown-city-slug]');
    linksToUpdate.forEach((link) => {
      const linkCity = link.getAttribute('exp-city-dropdown-city-slug');
      const baseHref = link.getAttribute('href');
      if (linkCity !== city && baseHref) {
        link.setAttribute(
          'href',
          baseHref.replace(/-(new-york|los-angeles|chicago|houston)$/i, `-${city}`)
        );
      }
    });
  }

  function setDefaultCity() {
    const defaultButton = Array.from(document.querySelectorAll('[location-dropdown_button]')).find(
      (button) => button.textContent.toUpperCase() === defaultCity.toUpperCase()
    );
    updateCityPlaceholders(defaultButton);
  }

  async function func_locationApi() {
    try {
      const response = await fetch('https://get.geojs.io/v1/ip/geo.json');
      const data = await response.json();
      const { city: apiCity } = data;

      if (apiCity) {
        findAndUpdateCity(apiCity);
      } else {
        setDefaultCity();
      }
    } catch (error) {
      setDefaultCity();
    }
  }

  function findAndUpdateCity(cityName) {
    const matchedButton = Array.from(document.querySelectorAll('[location-dropdown_button]')).find(
      (button) => button.textContent.toUpperCase() === cityName.toUpperCase()
    );

    if (matchedButton) {
      updateCityPlaceholders(matchedButton);
    } else {
      setDefaultCity();
    }
  }

  function updateCityPlaceholders(cityButton) {
    if (!cityButton) return;

    const cityName = cityButton.textContent;
    document.querySelectorAll('[city-dropdown-name-placeholder]').forEach((placeholder) => {
      placeholder.textContent = cityName;
      placeholder.classList.remove('opacity-0');
    });
    document.querySelectorAll('[location-dropdown]').forEach((dropdown) => {
      dropdown.classList.remove('opacity-0');
    });
    document.querySelector('[city-detector-tip]').classList.add('hide');
    document.querySelector('[city-guess]').textContent = cityName;
  }

  // Основная логика определения города
  if (savedCity) {
    findAndUpdateCity(savedCity);
  } else {
    const urlCity = getCityFromCurrentUrl();
    if (urlCity) {
      findAndUpdateCity(urlCity);
    } else {
      func_locationApi();
    }
  }

  // Слушатели событий для кнопок и ссылок
  const button_yes = document.querySelector('[is-your-city-new-york="yes"]');
  const button_no = document.querySelector('[is-your-city-new-york="no"]');
  const button_close = document.querySelector('[city-detector-tip-close]');
  const elements_navHomeLinks = document.querySelectorAll('[nav-home-link]');
  const elements_homePageCityLinks = document.querySelectorAll('[home-page-city-links]');

  [button_yes, button_no, button_close].forEach((btn) => {
    btn?.addEventListener('click', () =>
      document.querySelector('[city-detector-tip]').classList.add('hide')
    );
  });

  elements_navHomeLinks.forEach((navHomeLink) => {
    navHomeLink.addEventListener('click', () => {
      window.location.href = element_detectedCity?.getAttribute('href') || '#';
    });
  });

  elements_homePageCityLinks.forEach((cityLink) => {
    cityLink.addEventListener('click', function () {
      saveCity(cityLink);
    });
  });

  function saveCity(cityButton) {
    const cityName =
      cityButton.getAttribute('location-dropdown_button') ||
      cityButton.getAttribute('home-page-city-links');
    const cityLink = cityButton.getAttribute('href');

    if (cityName) {
      localStorage.setItem('savedCity', cityName);
      updateCityPlaceholders(cityButton);
      document.querySelector('[city-detector-tip]').classList.add('hide');
      window.location.href = cityLink;
    }
  }
};
