export const dates = () => {
  console.log('123');

  // document.addEventListener('DOMContentLoaded', function () {
  //   // Убираем завершающий слэш
  //   const path = window.location.pathname.replace(/\/$/, '');
  //   if (path !== '/dates') {
  //     console.log('[Redirect script] Не /dates, выходим.');
  //     return;
  //   }
  //   console.log('[Redirect script] Запустился на /dates');

  //   const defaultCity = 'new york';
  //   const availableCities = ['new york', 'los angeles', 'chicago', 'houston'];

  //   function normalizeCity(city: string) {
  //     return city.trim().toLowerCase().replace(/\s+/g, '-');
  //   }

  //   function handleRedirect(city: string) {
  //     const slug = normalizeCity(city);
  //     const targetPath = `/dates-night-${slug}`;
  //     if (window.location.pathname.replace(/\/$/, '') === targetPath) return;
  //     console.log(`[Redirect script] Редирект на: ${targetPath}`);
  //     window.location.href = targetPath;
  //   }

  //   const savedCity = sessionStorage.getItem('savedCity');
  //   if (savedCity) {
  //     console.log('[Redirect script] Найден сохранённый город:', savedCity);
  //     handleRedirect(savedCity);
  //     return;
  //   }

  //   console.log('[Redirect script] Нет сохранённого города, делаем fetch...');
  //   fetch('https://ipinfo.io?token=e244e6770c04f8')
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log('[Redirect script] Данные от API:', data);
  //       const apiCity = data.city;
  //       if (!apiCity) {
  //         console.log('[Redirect script] API не вернул город, используем дефолт.');
  //         handleRedirect(defaultCity);
  //         return;
  //       }
  //       const matchedCity = availableCities.find(
  //         (city) => city.toLowerCase() === apiCity.toLowerCase()
  //       );
  //       if (matchedCity) {
  //         sessionStorage.setItem('savedCity', matchedCity);
  //         console.log('[Redirect script] Найден город из списка:', matchedCity);
  //         handleRedirect(matchedCity);
  //       } else {
  //         console.log('[Redirect script] Город не в списке, используем дефолт.');
  //         handleRedirect(defaultCity);
  //       }
  //     })
  //     .catch((err) => {
  //       console.error('[Redirect script] Ошибка при fetch:', err);
  //       handleRedirect(defaultCity);
  //     });
  // });
};
