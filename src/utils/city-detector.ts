export const cityDetector_func = () => {
  const defaultCity = 'New york';
  const savedCity = localStorage.getItem('savedCity')
    ? localStorage.getItem('savedCity').replace('-', ' ')
    : null;

  // Получаем город из URL
  function getCityFromCurrentUrl() {
    const urlPath = window.location.pathname;
    const cityMatch = urlPath.match(/(?:\/city\/|\/|-)(new-york|los-angeles|chicago|houston)$/i);
    return cityMatch ? cityMatch[1].toLowerCase().replace('-', ' ') : null;
  }

  function setDefaultCity() {
    const defaultButton = Array.from(document.querySelectorAll('[location-dropdown_button]')).find(
      (button) => button.textContent.toUpperCase() === defaultCity.toUpperCase()
    );
    updateCityPlaceholders(defaultButton, defaultCity);
  }

  async function func_locationApi() {
    try {
      const response = await fetch('https://ipinfo.io?token=e244e6770c04f8');
      const data = await response.json();
      const { city: apiCity } = data;

      // Проверяем наличие savedCity
      if (savedCity) {
        findAndUpdateCity(savedCity);
        return;
      }

      const availableCities = ['new york', 'los angeles', 'chicago', 'houston'];
      const matchedCity = availableCities.find(
        (city) => city.toLowerCase() === apiCity.toLowerCase()
      );

      if (matchedCity) {
        // Если город найден, показываем его в [city-guess]
        findAndUpdateCity(matchedCity);
        document.querySelector('[city-guess]').textContent = matchedCity;
      } else {
        // Если город не найден в доступных, показываем город по умолчанию
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
      updateCityPlaceholders(matchedButton, cityName);
    } else {
      setDefaultCity();
    }
  }

  function updateCityPlaceholders(cityButton, cityName) {
    if (!cityButton) return;

    document.querySelectorAll('[city-dropdown-name-placeholder]').forEach((placeholder) => {
      placeholder.textContent = cityName;
      placeholder.classList.remove('opacity-0');
    });
    document.querySelectorAll('[location-dropdown]').forEach((dropdown) => {
      dropdown.classList.remove('opacity-0');
    });
  }

  // Основная логика определения города
  if (savedCity) {
    findAndUpdateCity(savedCity);
  } else {
    const urlCity = getCityFromCurrentUrl();
    document.querySelector('[city-detector-tip]')?.classList.remove('hide');
    document.querySelector('[city-guess]').textContent = defaultCity;
    if (urlCity) {
      findAndUpdateCity(urlCity);
    } else {
      func_locationApi();
    }
  }

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

  button_yes?.addEventListener('click', () => {
    const currentCity = document
      .querySelector('[city-guess]')
      .textContent.toLowerCase()
      .replace(' ', '-');
    localStorage.setItem('savedCity', currentCity);

    findAndUpdateCity(currentCity);

    window.location.href = '/city/' + currentCity;
  });

  button_no?.addEventListener('click', () => {
    document.querySelector('[location-dropdown_list')?.classList.add('w--open');
  });

  elements_navHomeLinks.forEach((navHomeLink) => {
    navHomeLink.addEventListener('click', (event) => {
      event.preventDefault(); // Отменяем стандартный переход по ссылке

      // Определяем, находимся ли мы на странице с привязкой к городу
      const cityPattern = /(?:\/city\/|\/|-)(new-york|los-angeles|chicago|houston)$/i;
      const currentPath = window.location.pathname;
      const cityMatch = currentPath.match(cityPattern);

      // Проверяем, есть ли сохранённый город
      const detectedCity = savedCity || defaultCity;

      if (cityMatch) {
        // Если текущий URL соответствует шаблону города, переходим на /city/город
        window.location.href = `/city/${detectedCity.replace(' ', '-')}`;
      } else {
        // Иначе переходим по стандартной ссылке
        const cityHref = navHomeLink.getAttribute('href');
        window.location.href = cityHref || '#';
      }
    });
  });

  elements_homePageCityLinks.forEach((cityLink) => {
    cityLink.addEventListener('click', function () {
      saveCity(cityLink);
    });
  });

  const locationDropdownButtons = document.querySelectorAll('[location-dropdown_button]');

  locationDropdownButtons.forEach((button) => {
    button.addEventListener('click', () => {
      saveCity(button);
    });
  });

  function saveCity(cityButton) {
    const cityName = cityButton.getAttribute('location-dropdown_button');
    const cityLink = cityButton.getAttribute('href');

    if (cityName) {
      localStorage.setItem('savedCity', cityName);
      updateCityPlaceholders(cityButton, cityName);
      window.location.href = cityLink;
    }
  }
};
