export const mobile_menu = () => {
  const burgerButton = document.querySelector('[data-burger-button]');
  const menuItems = document.querySelectorAll('[data-menu-item]');
  const menu = document.querySelector('[data-menu]');
  const breakpoint = 992; // Максимальное значение ширины экрана в пикселях

  const toggleMenu = () => {
    if (window.innerWidth <= breakpoint && menu) {
      menu.classList.toggle('open');
    }
  };

  burgerButton?.addEventListener('click', toggleMenu);

  menuItems.forEach((item) => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= breakpoint) {
        burgerButton?.click();
      }
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > breakpoint && menu?.classList.contains('open')) {
      menu.classList.remove('open');
    }
  });
};
