export function giftCard_redirect() {
  const giftCardLink = document.querySelector('[data-menu-link="gift-card"]');
  if (!giftCardLink) return;

  giftCardLink.addEventListener('click', (event) => {
    event.preventDefault(); // Останавливаем стандартное поведение

    const savedCity = sessionStorage.getItem('savedCity') || 'new-york';
    const citySlug = savedCity.replace(' ', '-');
    const targetUrl = `/city/${citySlug}#gift-card`;

    window.location.href = targetUrl;
  });
}
