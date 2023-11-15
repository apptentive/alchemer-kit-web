/**
 * Renders the Message Center intro (automated_message).
 *
 * @param {string} introText - The content to use for the introduction
 * @returns {HTMLDivElement} - The intro DOM Node.
 */
const renderIntroduction = (introText?: string) => {
  const introElement = document.createElement('div');
  introElement.classList.add('apptentive-intro');

  if (introText) {
    const introTextElement = document.createElement('p');
    introTextElement.classList.add('apptentive-typography__lead');
    introTextElement.textContent = introText;

    introElement.append(introTextElement);
  }

  return introElement;
};

export default renderIntroduction;
