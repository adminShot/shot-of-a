export const contacts_redirect = () => {
  document.querySelectorAll('[menu-contact]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('contacts');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = '/about#contacts';
      }
    });
  });
};
