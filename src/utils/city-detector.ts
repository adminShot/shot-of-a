/**
 * Глобальный детектор города.
 * 1. Берёт все <… location-dropdown_button …> → строит массив городов.
 * 2. Пытается определить текущий город в такой очередности:
 *    a) sessionStorage.savedCity
 *    b) /city/<slug> в URL
 *    c) ipinfo.io
 *    d) дефолт (первый город в списке)
 * 3. Обновляет плейсхолдеры, ссылочки и всё остальное.
 */
export function initCityDetector(): void {
  /* ---------- helpers ---------- */

  const slugify = (s: string) => s.trim().toLowerCase().replace(/\s+/g, '-');
  const unslugify = (s: string) => s.replace(/-/g, ' ');

  /* ---------- pull cities from DOM ---------- */

  const cityButtons = document.querySelectorAll<HTMLElement>('[location-dropdown_button]');
  const citySet = new Map<string, string>(); // slug -> pretty
  cityButtons.forEach((btn) => {
    const raw = (btn.getAttribute('location-dropdown_button') ?? btn.textContent ?? '').trim();
    const slug = slugify(raw);
    if (slug) citySet.set(slug, unslugify(slug));
  });
  if (!citySet.size) {
    console.error('No cities found in DOM — aborting city detector.');
    return;
  }

  const cities = [...citySet.keys()]; // ['new-york', ...]
  const getPrettyBySlug = (slug: string) => citySet.get(slug) ?? slug;
  const cityAlternationRegex = cities.join('|'); // new-york|los-angeles|…
  const cityInUrlRegex = new RegExp(`(?:/city/|/|-)(?:${cityAlternationRegex})$`, 'i');
  const cityTailRegex = new RegExp(`-(${cityAlternationRegex})$`, 'i');

  /* ---------- state ---------- */

  const defaultCitySlug = cities[0]; // первый из списка
  const savedCitySlug = sessionStorage.getItem('savedCity') ?? null; // slug

  /* ---------- DOM shortcuts ---------- */

  const cityGuessEl = document.querySelector<HTMLElement>('[city-guess]');
  const tipEl = document.querySelector<HTMLElement>('[city-detector-tip]');

  const updateCityPlaceholders = (slug: string) => {
    const pretty = getPrettyBySlug(slug);
    document.querySelectorAll('[city-dropdown-name-placeholder]').forEach((node) => {
      node.textContent = pretty;
      node.classList.remove('opacity-0');
    });
    document
      .querySelectorAll('[location-dropdown]')
      .forEach((d) => d.classList.remove('opacity-0'));
  };

  const activateCity = (slug: string) => {
    updateCityPlaceholders(slug);
    // подчёркиваем активную кнопку, если надо
    cityButtons.forEach((btn) => {
      const btnSlug = slugify(btn.getAttribute('location-dropdown_button') ?? '');
      btn.classList.toggle('is-active', btnSlug === slug);
    });
  };

  /* ---------- city detection chain ---------- */

  const getCityFromUrl = (): string | null => {
    const match = window.location.pathname.match(cityInUrlRegex);
    return match ? slugify(match[0].split('/').pop() ?? '') : null;
  };

  const resolveCityViaApi = async (): Promise<string | null> => {
    try {
      const cached = sessionStorage.getItem('cityFromApi');
      if (cached) return cached;

      const res = await fetch('https://ipinfo.io?token=e244e6770c04f8');
      const json = await res.json();
      const slug = slugify(json.city);
      if (cities.includes(slug)) {
        sessionStorage.setItem('cityFromApi', slug);
        return slug;
      }
    } catch (_) {
      /* silent */
    }
    return null;
  };

  const decideCity = async (): Promise<string> => {
    if (savedCitySlug) return savedCitySlug;
    const urlCity = getCityFromUrl();
    if (urlCity) return urlCity;
    const apiCity = await resolveCityViaApi();
    if (apiCity) return apiCity;
    return defaultCitySlug;
  };

  /* ---------- kick off ---------- */

  decideCity().then((currentSlug) => {
    activateCity(currentSlug);

    if (tipEl) {
      tipEl.classList.remove('hide');
      cityGuessEl && (cityGuessEl.textContent = getPrettyBySlug(currentSlug));
    }
  });

  /* ---------- UI events ---------- */

  /* 1. buttons inside the tip (“yes / no / close”) */
  if (tipEl) {
    const btnYes = document.querySelector('[is-your-city-new-york="yes"]');
    const btnNo = document.querySelector('[is-your-city-new-york="no"]');
    const btnClose = document.querySelector('[city-detector-tip-close]');

    [btnYes, btnNo, btnClose].forEach((btn) =>
      btn?.addEventListener('click', () => tipEl.classList.add('hide'))
    );

    btnYes?.addEventListener('click', () => {
      const slug = slugify(cityGuessEl?.textContent ?? '');
      if (slug) {
        sessionStorage.setItem('savedCity', slug);
        activateCity(slug);
        window.location.href = `/city/${slug}`;
      }
    });

    btnNo?.addEventListener('click', () => {
      document.querySelector('[location-dropdown_list]')?.classList.add('w--open');
    });
  }

  /* 2. nav-home links — перекидываем на /city/<slug> если уже на городском урле */
  document.querySelectorAll<HTMLElement>('[nav-home-link]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const path = window.location.pathname;
      const cityInPath = path.match(cityTailRegex)?.[1] ?? null;
      const targetSlug = sessionStorage.getItem('savedCity') ?? defaultCitySlug;

      if (cityInPath) {
        window.location.href = `/city/${targetSlug}`;
      } else {
        window.location.href = link.getAttribute('href') ?? '#';
      }
    });
  });

  /* 3. every city-button saves city and refreshes */
  const saveCityAndReload = (slug: string) => {
    sessionStorage.setItem('savedCity', slug);

    /* replace city slug in current URL (when it’s already there) */
    let newUrl = window.location.pathname.replace(cityTailRegex, `-${slug}`);
    if (newUrl === window.location.pathname) {
      newUrl = `/city/${slug}`;
    }

    const hash = window.location.hash;
    if (`${newUrl}${hash}` !== window.location.href) {
      window.location.href = `${newUrl}${hash}`;
    }
  };

  /* a) dropdown & header buttons */
  cityButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const slug = slugify(btn.getAttribute('location-dropdown_button') ?? '');
      if (slug) saveCityAndReload(slug);
    });
  });

  /* b) special “home page tiles” */
  document.querySelectorAll<HTMLElement>('[home-page-city-links]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const slug = slugify(btn.getAttribute('home-page-city-links') ?? '');
      if (slug) saveCityAndReload(slug);
    });
  });
}
