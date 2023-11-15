/**
 * Renders a given surveys submit button.
 *
 * @param {string} text - The disclaimer text to render
 * @returns {HTMLDivElement} - The DOM Node
 */
const renderDisclaimerText = (text: string) => {
  const disclaimerText = document.createElement('p');
  disclaimerText.classList.add('apptentive-disclaimer__text');
  disclaimerText.classList.add('apptentive-typography__description');
  disclaimerText.classList.add('apptentive-typography__description--tall');
  disclaimerText.textContent = text;

  // If the disclaimer text is long, decrease the font size slightly to provide more room for the rest of the interaction
  if (text.length > 160) {
    disclaimerText.style.fontSize = '12px';
  }

  const disclaimerWrapper = document.createElement('div');
  disclaimerWrapper.classList.add('apptentive-disclaimer');
  disclaimerWrapper.appendChild(disclaimerText);

  return disclaimerWrapper;
};

export default renderDisclaimerText;
