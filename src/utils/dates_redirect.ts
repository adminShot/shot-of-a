export const dates = () => {
  const path = window.location.pathname.replace(/\/$/, '');
  if (path !== '/dates') {
    return;
  }

  const defaultCity = 'new york';
  const availableCities = ['new york', 'los angeles', 'chicago', 'houston'];

  function normalizeCity(city: string) {
    return city.trim().toLowerCase().replace(/\s+/g, '-');
  }

  function handleRedirect(city: string) {
    const slug = normalizeCity(city);
    const targetPath = `/dates-night-${slug}`;
    if (window.location.pathname.replace(/\/$/, '') === targetPath) return;
    window.location.href = targetPath;
  }

  const savedCity = sessionStorage.getItem('savedCity');
  if (savedCity) {
    handleRedirect(savedCity);
    return;
  }

  console.log('[Redirect script] Нет сохранённого города, делаем fetch...');
  fetch('https://ipinfo.io?token=e244e6770c04f8')
    .then((response) => response.json())
    .then((data) => {
      const apiCity = data.city;
      if (!apiCity) {
        handleRedirect(defaultCity);
        return;
      }
      const matchedCity = availableCities.find(
        (city) => city.toLowerCase() === apiCity.toLowerCase()
      );
      if (matchedCity) {
        sessionStorage.setItem('savedCity', matchedCity);
        handleRedirect(matchedCity);
      } else {
        handleRedirect(defaultCity);
      }
    })
    .catch((err) => {
      console.error('[Redirect script] Ошибка при fetch:', err);
      handleRedirect(defaultCity);
    });
};
