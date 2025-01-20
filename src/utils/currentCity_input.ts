export const currentCity_input = () => {
  let city = 'no-city';

  // Проверяем наличие атрибута this-is-a-city-page
  const cityAttr = document.body.getAttribute('this-is-a-city-page');
  if (cityAttr) {
    city = cityAttr;
  } else if (typeof sessionStorage !== 'undefined') {
    // Если нет атрибута, проверяем localStorage
    const savedCity = sessionStorage.getItem('savedCity');

    if (savedCity) {
      city = savedCity;
    } else {
      // Если нет savedCity в localStorage, проверяем URL на наличие города
      const url = window.location.href.toLowerCase();
      const cities = ['new-york', 'los-angeles', 'chicago', 'houston'];

      // Ищем в URL одно из названий городов
      for (const cityName of cities) {
        if (url.includes(cityName)) {
          city = cityName.replace('-', ' ');
          break;
        }
      }
    }

    const savedCityFromApi = sessionStorage.getItem('cityFromApi');

    if (!savedCity && savedCityFromApi) {
      city = savedCityFromApi;
    }
  } else {
    console.warn('localStorage не поддерживается данным браузером.');
  }

  // Находим все формы на странице
  const forms = document.querySelectorAll('form');

  if (forms.length > 0) {
    forms.forEach(function (form) {
      // Находим или создаем input с именем current-city
      let cityInput = form.querySelector('input[name="current-city"]');
      if (!cityInput) {
        // Если input с current-city не найден, создаем его
        cityInput = document.createElement('input');
        cityInput.type = 'text';
        cityInput.classList.add('hide');
        cityInput.name = 'current-city';
        form.appendChild(cityInput);
      }
      // Устанавливаем значение current-city
      cityInput.value = city;
    });
  }
};
