export const cityDetector_func = () => {
  const elements_cityDropdown = document.querySelectorAll('[location-dropdown]');
  const elements_navHomeLinks = document.querySelectorAll('[nav-home-link]');
  const elements_homePageCityLinks = document.querySelectorAll('[home-page-city-links]');

  if (elements_cityDropdown.length) {
    const defaultCity = 'New York';
    const all_cityButtons = document.querySelectorAll(
      '[section_menu] [location-dropdown_button], [location-dropdown_list] [location-dropdown_button]'
    );
    const button_yes = document.querySelector('[is-your-city-new-york="yes"]');
    const button_no = document.querySelector('[is-your-city-new-york="no"]');
    const button_ok = document.querySelector('[is-your-city-new-york="ok"]');
    const button_close = document.querySelector('[city-detector-tip-close]');
    const el_cityPopup = document.querySelector('[city-detector-tip]');
    const el_cityName = document.querySelector('[city-guess]');
    const el_cityQuestion = document.querySelector('[city-question]');
    const el_locationDropdownList = document.querySelector('[location-dropdown_list]');
    let element_detectedCity;

    function getCityFromUrl() {
      const params = new URLSearchParams(window.location.search);
      return params.get('testCity');
    }

    async function func_locationApi() {
      const cityFromUrl = getCityFromUrl();
      let city;

      if (cityFromUrl) {
        city = cityFromUrl;

        if (city) {
          let cityMatched = false;
          all_cityButtons.forEach((cityButton) => {
            if (cityButton.textContent.toUpperCase() === city.toUpperCase()) {
              element_detectedCity = cityButton;
              cityMatched = true;
              cityGuess();
            }
          });
          if (!cityMatched) {
            setDefaultCity();
          }
        } else {
          setDefaultCity();
        }
      } else {
        try {
          const response = await fetch('https://get.geojs.io/v1/ip/geo.json');
          const data = await response.json();

          console.log(data);

          const { city: respCity } = data;
          if (respCity) {
            let cityMatched = false;
            all_cityButtons.forEach((cityButton) => {
              if (cityButton.textContent.toUpperCase() === city.toUpperCase()) {
                element_detectedCity = cityButton;
                cityMatched = true;
                cityGuess();
              }
            });
            if (!cityMatched) {
              setDefaultCity();
              saveCity(respCity);
            }
          } else {
            setDefaultCity();
          }
        } catch (error) {
          setDefaultCity();
        }
      }
    }

    function setDefaultCity() {
      let defaultCitySet = false;
      all_cityButtons.forEach((cityButton) => {
        if (cityButton.textContent.toUpperCase() === defaultCity.toUpperCase()) {
          element_detectedCity = cityButton;
          defaultCitySet = true;
          cityGuess();
        }
      });
    }

    button_yes.addEventListener('click', function () {
      saveCity(element_detectedCity);
    });

    button_no.addEventListener('click', function () {
      el_cityPopup.classList.add('hide');
      el_locationDropdownList.classList.add('w--open');
    });

    button_close.addEventListener('click', function () {
      el_cityPopup.classList.add('hide');
    });

    function cityGuess() {
      el_cityName.textContent = element_detectedCity.textContent;
      el_cityName.classList.remove('opacity-0');
      el_cityPopup.classList.remove('hide');
      elements_cityDropdown.forEach((element) => {
        element.classList.remove('opacity-0');
      });
      const allCityPlaceholders = document.querySelectorAll('[city-dropdown-name-placeholder]');
      allCityPlaceholders.forEach((placeholder) => {
        placeholder.classList.remove('opacity-0');
      });
    }

    function saveCity(city) {
      const currentCity =
        city.getAttribute('location-dropdown_button') || city.getAttribute('home-page-city-links');
      const currentCityLink = city.getAttribute('href');

      localStorage.setItem('savedCity', currentCity);
      updateCityPlaceholders(city);
      el_cityPopup.classList.add('hide');
      window.location.href = currentCityLink;
    }

    function updateCityPlaceholders(city) {
      const cityName =
        city.getAttribute('location-dropdown_button') || city.getAttribute('home-page-city-links');
      const allCityPlaceholders = document.querySelectorAll('[city-dropdown-name-placeholder]');
      allCityPlaceholders.forEach((placeholder) => {
        placeholder.textContent = cityName;
        placeholder.classList.remove('opacity-0');
      });
      elements_cityDropdown.forEach((element) => {
        element.classList.remove('opacity-0');
      });
    }

    function findElementOfCurrentCity(textNameOfCity) {
      let cityFound = false;
      all_cityButtons.forEach((cityButton) => {
        if (
          cityButton.getAttribute('location-dropdown_button').toUpperCase() ===
          textNameOfCity.toUpperCase()
        ) {
          const currentCityButton = cityButton;
          element_detectedCity = currentCityButton;
          updateCityPlaceholders(currentCityButton);
          cityFound = true;
        }
      });
      if (!cityFound) {
        setDefaultCity();
      }
    }

    if (localStorage.getItem('savedCity')) {
      const savedCity = localStorage.getItem('savedCity');
      findElementOfCurrentCity(savedCity);
      elements_cityDropdown.forEach((element) => {
        element.classList.remove('opacity-0');
      });
    } else {
      func_locationApi();
    }

    all_cityButtons.forEach((cityButton) => {
      cityButton.addEventListener('click', function () {
        saveCity(cityButton);
        updateCityPlaceholders(cityButton);
        elements_cityDropdown.forEach((element) => {
          element.classList.remove('opacity-0');
        });
      });
    });

    elements_navHomeLinks.forEach((navHomeLink) => {
      navHomeLink.addEventListener('click', function () {
        if (element_detectedCity) {
          const cityLink = element_detectedCity.getAttribute('href');
          window.location.href = cityLink;
        } else {
          setDefaultCity();
          const cityLink = element_detectedCity.getAttribute('href');
          window.location.href = cityLink;
        }
      });
    });

    elements_homePageCityLinks.forEach((cityLink) => {
      cityLink.addEventListener('click', function (event) {
        event.preventDefault(); // Останавливаем стандартное поведение ссылки
        saveCity(cityLink); // Сохраняем город
      });
    });
  }

  // Новый функционал для работы с parallel-page-type
  const bodyElement = document.querySelector('body');
  const pageType = bodyElement.getAttribute('parallel-page-type');

  if (pageType === 'event' || pageType === 'individual') {
    const parentElement = document.querySelector(`[parallel-page-links-parent="${pageType}"]`);
    const linksWithExpCity = parentElement.querySelectorAll('[exp-city]');
    const dropdownLinks = document.querySelectorAll(
      '[parallel-location-dropdown_list] [location-dropdown_button]'
    );

    linksWithExpCity.forEach((expLink) => {
      const expCity = expLink.getAttribute('exp-city');
      dropdownLinks.forEach((dropdownLink) => {
        const locationCity = dropdownLink.getAttribute('location-dropdown_button');
        if (expCity === locationCity) {
          const newHref = expLink.getAttribute('href');
          dropdownLink.setAttribute('href', newHref);
        }
      });
    });
  }
};
