export const footer_yer = () => {
  const currentYearField = document.getElementById('current-year');
  if (currentYearField) currentYearField.innerText = String(new Date().getFullYear());
};
