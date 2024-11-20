export const countryInput_func = () => {
  const usaVariants = [
    'USA',
    'usa',
    'United States of America',
    'united states of america',
    'United States',
    'united states',
  ];

  const countryInputs = document.querySelectorAll('[data-country]');

  countryInputs.forEach((countryElement) => {
    const handleCountryChange = () => {
      const stateInput = document.querySelector(`[data-state="${countryElement.dataset.country}"]`);
      const stateDropdown = document.querySelector(
        `[data-state-dropdown="${countryElement.dataset.country}"]`
      );

      // Добавляем проверку на существование элементов
      if (!stateInput || !stateDropdown) {
        console.error('State input or dropdown not found for:', countryElement.dataset.country);
        return; // Прерываем, если элементы не найдены
      }

      if (!usaVariants.includes(countryElement.value)) {
        stateDropdown.style.display = 'none';
        stateInput.required = false;
      } else {
        stateDropdown.style.display = 'block';
        stateInput.required = true;
      }
    };

    // Привязываем обработчик к событиям input и change
    countryElement.addEventListener('input', handleCountryChange);
    countryElement.addEventListener('change', handleCountryChange);
  });
};
