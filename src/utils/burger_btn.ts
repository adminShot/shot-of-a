export const burger_btn = () => {
  let click = 0;
  $('.burger-button').click(function () {
    if (click === 0) {
      click++;
      $('body').css('overflow', 'hidden');
    } else {
      click--;
      $('body').css('overflow', 'visible');
    }
  });

  $('.burger-button')
    .find('a')
    .click(function () {
      click--;
      $('body').css('overflow', 'visible');
    });
};
