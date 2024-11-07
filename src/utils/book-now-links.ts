export const bookLinks_func = () => {
  const bookLinks_el = document.querySelectorAll('[book-now-button]');

  if (bookLinks_el.length) {
    bookLinks_el.forEach((elButton) => {
      const linkFromAtribute = elButton.getAttribute('book-now-button');

      if (linkFromAtribute != '') {
        const currentCity = document.body.getAttribute('this-is-a-city-page');
        const atribute_linksItemsList_readyFalse = linkFromAtribute
          .split(';')
          .filter((item) => item.trim() !== '');
        const atribute_linksItemsList_readyTrue = [];
        atribute_linksItemsList_readyFalse.forEach((el) => {
          const part_first = el.split('@')[0];
          const part_second = el.split('@')[1];
          if (part_first === currentCity) {
            elButton.setAttribute('href', part_second);
            elButton.classList.remove('hide');
          }
        });
      }
    });
  }
};
