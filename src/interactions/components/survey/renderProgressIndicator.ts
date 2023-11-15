/**
 * Renders the step indicator at the bottom of the survey.
 *
 * @param {number} questionCount - The number of questions to track progress for
 * @returns {HTMLUListElement} - The DOM Node
 */
const renderProgressIndicator = (questionCount: number) => {
  const progressIndicatorWrapper = document.createElement('div');
  progressIndicatorWrapper.classList.add('apptentive-progress__wrapper');

  // Render progress bar if the number of questions is greater than 10
  if (questionCount > 10) {
    const progressBarElement = document.createElement('progress');
    progressBarElement.classList.add('apptentive-progress-bar');
    progressBarElement.max = 100;
    progressBarElement.value = 0;

    progressIndicatorWrapper.append(progressBarElement);
    return progressIndicatorWrapper;
  }

  // Otherwise render the step indicator with the number of questions
  const progressStepElement = document.createElement('ul');
  progressStepElement.classList.add('apptentive-step-indicator');

  // Create a page indicator based on how many total segments are configured for this survey
  for (let i = 0; i < questionCount; i++) {
    const indicatorElement = document.createElement('li');
    indicatorElement.classList.add('apptentive-step-indicator__item');

    if (i === 0) {
      indicatorElement.classList.add('apptentive-step-indicator__item--current');
    }

    progressStepElement.append(indicatorElement);
  }

  progressIndicatorWrapper.append(progressStepElement);
  return progressIndicatorWrapper;
};

export default renderProgressIndicator;
