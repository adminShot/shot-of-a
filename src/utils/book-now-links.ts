export const bookLinks_func = () => {
  const bookLinks_el = document.querySelectorAll('[book-now-button]');
  console.log('Найдено кнопок:', bookLinks_el.length);

  if (bookLinks_el.length) {
    bookLinks_el.forEach((elButton) => {
      const linkFromAtribute = elButton.getAttribute('book-now-button');
      console.log('Атрибут book-now-button:', linkFromAtribute);

      if (linkFromAtribute != '') {
        const currentCity = document.body.getAttribute('this-is-a-city-page');
        console.log('Текущий город:', currentCity);

        const atribute_linksItemsList_readyFalse = linkFromAtribute
          .split(';')
          .filter((item) => item.trim() !== '');
        console.log('Список необработанных ссылок:', atribute_linksItemsList_readyFalse);

        const atribute_linksItemsList_readyTrue = [];
        atribute_linksItemsList_readyFalse.forEach((el) => {
          console.log('Обработка элемента:', el);

          const part_first = el.split('@')[0];
          const part_second = el.split('@')[1];
          console.log('Часть первая (город):', part_first);
          console.log('Часть вторая (ссылка):', part_second);

          if (part_first === currentCity) {
            elButton.setAttribute('href', part_second);
            elButton.classList.remove('hide');
            console.log('Установлен href:', part_second, 'для кнопки:', elButton);
          }
        });
      }
    });
  }
};
