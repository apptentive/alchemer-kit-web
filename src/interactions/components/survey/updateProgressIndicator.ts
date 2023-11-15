/**
 * Updates the progress indicator element based on the current question index
 *
 * @param {number} stepCount - The total number of steps being tracked
 * @param {number} nextIndex - The next step index the indicator should update to
 */
const updateProgressIndicator = (stepCount: number, nextIndex = 0) => {
  // Update the value of the progress bar if the count is greater than 10
  if (stepCount > 10) {
    const progressBarElement = document.querySelector<HTMLProgressElement>('.apptentive-progress-bar');

    if (progressBarElement) {
      progressBarElement.value = (nextIndex / stepCount) * 100;
    }

    return;
  }

  // Otherwise update the step indicators
  const indicatorClass = 'apptentive-step-indicator__item';
  const currentModifier = 'current';
  const completeModifier = 'complete';

  // Remove the modifier class from the current page element
  const currentElement = document.querySelector(`.${indicatorClass}--${currentModifier}`);

  if (currentElement) {
    currentElement.classList.remove(`${indicatorClass}--${currentModifier}`);
  }

  const indicatorElements = document.querySelectorAll(`.${indicatorClass}`);

  if (indicatorElements.length > 0) {
    // Add the complete class to every indicator prior to the new current one
    // This is to make sure that when questions are skipped, they are not left in an "off" state
    Object.values(indicatorElements)
      .slice(0, nextIndex)
      .forEach((indicator) => {
        indicator.classList.toggle(`${indicatorClass}--${completeModifier}`, true);
      });

    indicatorElements[nextIndex].classList.add(`${indicatorClass}--${currentModifier}`);
  }
};

export default updateProgressIndicator;
