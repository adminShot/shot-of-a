export const cityDetector_func = () => {
  const defaultCity = 'new york';
  const savedCity = sessionStorage.getItem('savedCity')
    ? sessionStorage.getItem('savedCity')?.replace('-', ' ')
    : null;

  // Получаем город из URL
  function getCityFromCurrentUrl() {
    const urlPath = window.location.pathname;
    const cityMatch = urlPath.match(/(?:\/city\/|\/|-)(new-york|los-angeles|chicago|houston)$/i);
    return cityMatch ? cityMatch[1].toLowerCase().replace('-', ' ') : null;
  }

  function setDefaultCity() {
    const locationButtons = document.querySelectorAll<HTMLElement>('[location-dropdown_button]');
    const defaultButton = Array.from(locationButtons).find(
      (button) => button.textContent?.toUpperCase() === defaultCity.toUpperCase()
    );
    updateCityPlaceholders(defaultButton, defaultCity);
  }

  async function func_locationApi() {
    try {
      const response = await fetch('https://ipinfo.io?token=e244e6770c04f8');
      const data = await response.json();
      const { city: apiCity } = data;

      saveCityToSessionStorage(apiCity);

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
        const cityGuess = document.querySelector('[city-guess]');
        if (cityGuess) cityGuess.textContent = matchedCity;
      } else {
        // Если город не найден в доступных, показываем город по умолчанию
        setDefaultCity();
      }
    } catch (error) {
      setDefaultCity();
    }
  }

  function saveCityToSessionStorage(city: string) {
    if (sessionStorage.getItem('cityFromApi')) return;
    sessionStorage.setItem('cityFromApi', city);
  }

  function findAndUpdateCity(cityName: string) {
    const locationButtons = document.querySelectorAll<HTMLElement>('[location-dropdown_button]');
    const matchedButton = Array.from(locationButtons).find(
      (button) => button.textContent?.toUpperCase() === cityName.toUpperCase()
    );

    if (matchedButton) {
      updateCityPlaceholders(matchedButton, cityName);
    } else {
      setDefaultCity();
    }
  }

  function updateCityPlaceholders(cityButton: HTMLElement | undefined, cityName: string) {
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
    const cityGuess = document.querySelector('[city-guess]');
    if (cityGuess) cityGuess.textContent = defaultCity;
    if (urlCity) {
      findAndUpdateCity(urlCity);
    } else {
      func_locationApi();
    }
  }

  const elements_navHomeLinks = document.querySelectorAll<HTMLElement>('[nav-home-link]');
  const elements_homePageCityLinks =
    document.querySelectorAll<HTMLElement>('[home-page-city-links]');
  const tip = document.querySelector<HTMLElement>('[city-detector-tip]');

  if (tip) {
    const button_yes = document.querySelector('[is-your-city-new-york="yes"]');
    const button_no = document.querySelector('[is-your-city-new-york="no"]');
    const button_close = document.querySelector('[city-detector-tip-close]');
    [button_yes, button_no, button_close].forEach((btn) => {
      btn?.addEventListener('click', () => tip.classList.add('hide'));
    });
    button_yes?.addEventListener('click', () => {
      const cityGuess = document.querySelector('[city-guess]');

      if (cityGuess) {
        const currentCity = cityGuess?.textContent?.toLowerCase().replace(' ', '-');
        if (currentCity) {
          sessionStorage.setItem('savedCity', currentCity);

          findAndUpdateCity(currentCity);

          window.location.href = '/city/' + currentCity;
        }
      }
    });

    button_no?.addEventListener('click', () => {
      document.querySelector('[location-dropdown_list')?.classList.add('w--open');
    });
  }

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

  const locationDropdownButtons = document.querySelectorAll<HTMLElement>(
    '[location-dropdown_button]'
  );

  locationDropdownButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      saveCity(button);
    });
  });

  function saveCity(cityButton: HTMLElement) {
    const cityName =
      cityButton.getAttribute('location-dropdown_button') ||
      cityButton.getAttribute('home-page-city-links');

    // Текущий путь и якорь
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash; // сохраняем якорь

    if (cityName) {
      sessionStorage.setItem('savedCity', cityName);

      // Определение, является ли страница "экспириенсом" или "эвентом"
      const isExperiencePage = /individual-art-experiences-/i.test(currentPath);
      const isEventPage = /events-/i.test(currentPath);
      const isDatesPage = /dates-night-/i.test(currentPath);

      // Проверка текущего города в URL и создание newUrl только при необходимости
      let newUrl = currentPath;
      const currentCityPattern = /-(new-york|los-angeles|chicago|houston)$/i;
      const match = currentPath.match(currentCityPattern);

      if (match && match[1].toLowerCase().replace('-', ' ') !== cityName.toLowerCase()) {
        // Меняем только город в URL, если он отличается
        newUrl = currentPath.replace(currentCityPattern, `-${cityName.replace(' ', '-')}`);
      } else if (!match && !(isExperiencePage || isEventPage || isDatesPage)) {
        // Если текущий URL не содержит город и это не страницы экспириенсов/эвентов
        newUrl = `/city/${cityName.replace(' ', '-')}`;
      }

      // Обновляем город и переходим по соответствующему URL, если он отличается от текущего
      updateCityPlaceholders(cityButton, cityName);

      // Добавляем currentHash к newUrl перед редиректом
      if (`${newUrl}${currentHash}` !== window.location.href) {
        window.location.href = `${newUrl}${currentHash}`;
      }
    } else {
      console.warn('City name not found on the button.');
    }
  }
};
