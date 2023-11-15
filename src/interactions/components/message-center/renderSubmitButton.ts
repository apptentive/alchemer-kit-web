/**
 * Renders the submit button.
 *
 * @param {string} buttonText - The text to use for the button content
 * @param {Function} onSubmit - The handler for the click event on the button
 * @returns {HTMLDivElement} - The button container DOM Node.
 */
const renderSubmitButton = (buttonText: string, onSubmit: VoidFunction) => {
  const submitButton = document.createElement('button');
  submitButton.type = 'button';
  submitButton.classList.add('apptentive-button--primary');
  submitButton.textContent = buttonText;
  submitButton.addEventListener('click', onSubmit);

  const errors = document.createElement('apptentive-errors');
  errors.className = 'apptentive-errors';
  errors.textContent = '';
  errors.style.display = 'none';

  const buttonWrapper = document.createElement('div');
  buttonWrapper.classList.add('apptentive-message-center__actions');
  buttonWrapper.append(submitButton);
  buttonWrapper.append(errors);

  return buttonWrapper;
};

export default renderSubmitButton;
