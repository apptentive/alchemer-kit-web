/**
 * Renders the survey introduction text.
 *
 * @param {string} introText - The text content for the introduction section
 * @returns {HTMLDivElement} - The DOM Node
 */
const renderIntroductionSection = (introText: string) => {
  const intro = document.createElement('div');
  intro.className = 'apptentive-survey-intro';
  intro.textContent = introText;

  return intro;
};

export default renderIntroductionSection;
