import renderDisclaimerText from './renderDisclaimerText';

const introductionSelector = 'apptentive-survey-introduction';

/**
 * Renders a static text step for a survey.
 *
 * @param {HTMLElement} parentContainer - The parent container the intro appears within.
 * @param {string} introText - The static introduction text to display.
 * @param {string} buttonText - The text to use for the button text.
 * @param {string} disclaimerText - The text to use for the disclaimer beneath the button.
 * @param {string} revealedElementSelector - The HTML selector to use for the element to display when the button is clicked.
 * @returns {HTMLElement} - The HTML element containing the introduction content.
 */
const renderIntroductionPage = (
  parentContainer: HTMLElement,
  introText?: string,
  buttonText?: string,
  disclaimerText?: string,
  revealedElementSelector = 'form.apptentive-survey-questions'
) => {
  const nextButtonNode = document.createElement('button');
  nextButtonNode.type = 'button';
  nextButtonNode.classList.add('apptentive-button--primary');
  nextButtonNode.textContent = buttonText || 'Start Survey';
  nextButtonNode.title = buttonText || 'Start Survey';
  nextButtonNode.addEventListener('click', (_) => {
    const introductionElement = parentContainer.querySelector<HTMLElement>(introductionSelector);
    const formElement = parentContainer.querySelector<HTMLFormElement>(revealedElementSelector);

    if (introductionElement && formElement) {
      introductionElement.style.display = 'none';
      formElement.style.display = '';
    }
  });

  const staticActionsNode = document.createElement('div');
  staticActionsNode.classList.add('apptentive-message__actions');
  staticActionsNode.append(nextButtonNode);

  // If there is disclaimer text render it here, otherwise add a class to format the intro page differently
  if (disclaimerText) {
    staticActionsNode.append(renderDisclaimerText(disclaimerText));
  } else {
    staticActionsNode.classList.add('apptentive-message__actions--tall');
  }

  const introductionNode = document.createElement(introductionSelector);
  introductionNode.classList.add('apptentive-message');

  if (introText) {
    const staticContentNode = document.createElement('p');
    staticContentNode.className = 'apptentive-message__content';
    staticContentNode.innerText = introText;

    const staticWrapperNode = document.createElement('div');
    staticWrapperNode.classList.add('apptentive-message__content-wrapper');
    staticWrapperNode.append(staticContentNode);

    introductionNode.append(staticWrapperNode);
  }

  introductionNode.append(staticActionsNode);

  return introductionNode;
};

export default renderIntroductionPage;
